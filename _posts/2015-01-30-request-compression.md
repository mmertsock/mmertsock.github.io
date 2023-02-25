---
title: "HTTP Request Compression in ServiceStack/ASP.NET"
layout: post
---

Compression of HTTP requests (not responses) is uncommon, so when I needed to support this in a [ServiceStack][] application, I found it difficult to scrape together comprehensive information about how to implement and test compressed request handling. This post collects in one place everything you need to to know.

## What does a compressed HTTP request look like?

Compressed HTTP requests are the counterpart to compressed responses: the headers are specified in the request, the client does the compression, and the server performs the decompression:

    POST /path HTTP/1.1
    Content-Type: application/json
    Content-Encoding: gzip

    <body content: raw gzip-compressed binary data>

The `Content-Encoding` header indicates that the body content of a `POST/PUT/PATCH` request is compressed, in this case using GZip. Note that the `Content-Type` still indicates the media type of the *uncompressed* data. Larger requests can be streamed using the `Transfer-Encoding: chunked` header (otherwise the size of the compressed data is indicated with the `Content-Length` header).

Compression is handled independently for requests and responses. The `Accept-Encoding` header, which is used to indicate a client’s preference for compressed responses, has no relation to request compression. Depending on the request headers and the capabilities of the client and server, a given session can have any combination of compressed or plaintext request and response.

Note that while a server can choose not to compress a response when requested by the client, this optionality is not possible with compressed requests. If the server does not support a given request Content-Encoding, it may refuse the request.

## Does ASP.NET or ServiceStack support compressed requests?

I did a fair amount of research and found no evidence that the ServiceStack framework, or ASP.NET in general, can decode compressed HTTP requests out of the box. Thus, I needed to roll my own implementation.

## Does the .NET framework provide a means to decompress GZip data?

Yes, the [`GZipStream`][GZipStream] class in the `System.IO.Compression` namespace can both compress and decompress data using GZip encoding. This class takes a `Stream` representing the input data along with an enum indicating the mode of operation (Compress or Decompress). When operating in Decompress mode, GZipStream’s output is raw decompressed bytes, and as a subclass of `Stream` itself, the output can be read incrementally, passed to other stream readers/adapters, or read in its entirety into a string or byte buffer.

This namespace has similar classes for other compression formats. While this post focuses on handling GZip-compressed requests, other formats can be supported by matching the appropriate Stream class (or third party compression library) to a [`Content-Encoding` value][encoding-tokens].

## Decompressing a GZip request body in ServiceStack

Using GZipStream, it isn’t hard to implement a basic ad-hoc decompression routine in a specific ServiceStack endpoint. Have your request DTO implement `IRequiresRequestStream` to get access to the raw data, or alternatively the Service class can access this using `Request.InputStream`. Feed this to the GZipStream class and the request body is decompressed. You will, however, need to manually deserialize the plaintext data if you are expecting a JSON or XML request, as it's already too late for ServiceStack to do this automatically. It wasn't a problem for me as the request I needed to handle was a flat file.

## Implementing a general solution

I figured it should be easy to build this in a generic way so that any <span class="nohyphen">ServiceStack</span> message could be decompressed automatically before it was parsed. However, initially I could not find a way to correctly modify the request body stream in ServiceStack or <span class="nohyphen">ASP.NET</span>.

With [help from the creator of ServiceStack][so], I learned that `System.Web.HttpRequest` objects have a [`Filter` property][filter] that allows piping the original input stream of the request through another stream. You can even compose several Filters to modify the request in various ways.

Using an HttpModule to apply a Filter to each incoming request, it’s easy to implement automatic decompression of all GZip-compressed request bodies:

    // Credit to https://stackoverflow.com/a/28159849/795339
    public class GZipRequestDecompressingModule : IHttpModule
    {
        public void Init(HttpApplication context)
        {
            context.BeginRequest += (sender, e) =>
            {
                var request = (sender as HttpApplication).Request;

                string contentEncoding = request.Headers["Content-Encoding"];

                if (string.Equals(contentEncoding, "gzip",
                    StringComparison.OrdinalIgnoreCase))
                {
                    request.Filter = new GZipStream(request.Filter,
                        CompressionMode.Decompress);
                    request.Headers.Remove("Content-Encoding");
                }
            };
        }
        public void Dispose()
        {
        }
    }

    // In web.config:
    <system.webServer>
        <modules runAllManagedModulesForAllRequests="true">
            <add name="AnyUniqueName"
                 type="YourNamespace.GZipRequestDecompressingModule, YourAssembly"
                 preCondition="integratedMode" />
        </modules>
    </system.webServer>

By running the decompression during the `BeginRequest` event, all ASP.NET and ServiceStack handler code that executes later will behave as if the request was sent in plaintext with no compression at all. Thus, ServiceStack will correctly bind JSON and XML requests, etc.

## Testing compressed HTTP requests

If you use [Fiddler][], a simple script will allow you to send any request with a compressed body. Select the *Rules > Customize Rules* menu item (Ctrl+R). Add the following near the end of the `OnBeforeRequest` function in the file that is opened:

    if (m_gzipRequest && oSession.requestBodyBytes != null &&
        oSession.requestBodyBytes.length > 0 && !oSession.oRequest.headers["Content-Encoding"])
    {
        oSession.requestBodyBytes = Utilities.GzipCompress(oSession.requestBodyBytes);
        oSession.oRequest["Content-Length"] = oSession.requestBodyBytes.Length.ToString();
        oSession.oRequest["Content-Encoding"] = "gzip";
    }

Near the top of the file are several `RulesOption` and global variable declarations. Add the following in that area:

    public static RulesOption("Apply GZip Encoding to Request")
    var m_gzipRequest: boolean = false;

Save the file, and the Rules menu in Fiddler should now show an *Apply GZip Encoding to Request* item. Click that menu item to enable/disable compression. When enabled, any request sent from the Composer view or resent from the Session List will be GZip compressed. The raw compressed data can be viewed/decoded in the Inspector after sending a request, and copying a request into the Composer window will allow directly editing a Base64-encoded version of the compressed data.

## Wrapping up

This post summarized everything I know about supporting GZip compressed HTTP requests in a ServiceStack service or ASP.NET application and how to test this using Fiddler. You should now know what a compressed request looks like, how to use GZipStream to decompress data, how to write an HTTP module that automatically handles every compressed request sent to your ASP.NET application or ServiceStack service, and how to add a script to Fiddler to automatically compress any request body. Let me know if there is anything missing or incorrect.

[ServiceStack]: https://servicestack.net
[GZipStream]: https://msdn.microsoft.com/en-us/library/system.io.compression.gzipstream(v=vs.110).aspx
[encoding-tokens]: https://en.wikipedia.org/wiki/HTTP_compression#Content-Encoding_tokens
[so]: https://stackoverflow.com/q/28159280/795339
[filter]: https://msdn.microsoft.com/en-us/library/system.web.httprequest.filter(v=vs.110).aspx
[Fiddler]: https://www.telerik.com/fiddler
