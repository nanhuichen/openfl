import ObjectPool from "../_internal/utils/ObjectPool";
import Event from "../events/Event";
import EventType from "../events/EventType";
import URLRequestHeader from "../net/URLRequestHeader";

/**
	The application dispatches HTTPStatusEvent objects when a network request
	returns an HTTP status code.

	HTTPStatusEvent objects are always sent before error or completion
	events. An HTTPStatusEvent object does not necessarily indicate an error
	condition; it simply reflects the HTTP status code(if any) that is
	provided by the networking stack. Some Flash Player environments may be
	unable to detect HTTP status codes; a status code of 0 is always reported
	in these cases.

	In Flash Player, there is only one type of HTTPStatus event:
	`httpStatus`. In the AIR runtime, a FileReference, URLLoader, or
	URLStream can register to listen for an `httpResponseStatus`,
	which includes `responseURL` and `responseHeaders`
	properties. These properties are undefined in a `httpStatus`
	event.
**/
export default class HTTPStatusEvent extends Event
{
	/**
		Unlike the `httpStatus` event, the `httpResponseStatus` event is
		delivered before any response data. Also, the `httpResponseStatus`
		event includes values for the `responseHeaders` and `responseURL`
		properties (which are undefined for an `httpStatus` event. Note that
		the `httpResponseStatus` event (if any) will be sent before (and in
		addition to) any `complete` or `error` event.
		The `HTTPStatusEvent.HTTP_RESPONSE_STATUS` constant defines the value
		of the `type` property of a `httpResponseStatus` event object.

		This event has the following properties:

		| Property | Value |
		| --- | --- |
		| `bubbles` | `false` |
		| `cancelable` | `false`; there is no default behavior to cancel. |
		| `currentTarget` | The object that is actively processing the Event object with an event listener. |
		| `responseURL` | The URL from which the response was returned. |
		| `responseHeaders` | The response headers that the response returned, as an array of URLRequestHeader objects. |
		| `status` | The HTTP status code returned by the server. |
		| `target` | The network object receiving an HTTP status code. |
	**/
	public static readonly HTTP_RESPONSE_STATUS: EventType<HTTPStatusEvent> = "httpResponseStatus";

	/**
		The `HTTPStatusEvent.HTTP_STATUS` constant defines the value of the
		`type` property of a `httpStatus` event object.
		This event has the following properties:

		| Property | Value |
		| --- | --- |
		| `bubbles` | `false` |
		| `cancelable` | `false`; there is no default behavior to cancel. |
		| `currentTarget` | The object that is actively processing the Event object with an event listener. |
		| `status` | The HTTP status code returned by the server. |
		| `target` | The network object receiving an HTTP status code.  |
	**/
	public static readonly HTTP_STATUS: EventType<HTTPStatusEvent> = "httpStatus";

	/**
		Indicates whether the request was redirected.
	**/
	public redirected: boolean;

	/**
		The response headers that the response returned, as an array of
		URLRequestHeader objects.
	**/
	public responseHeaders: Array<URLRequestHeader>;

	/**
		The URL that the response was returned from. In the case of redirects,
		this will be different from the request URL.
	**/
	public responseURL: string;

	protected static __pool: ObjectPool<HTTPStatusEvent> = new ObjectPool<HTTPStatusEvent>(() => new HTTPStatusEvent(null),
		(event) => event.__init());

	protected __status: number;

	/**
		Creates an Event object that contains specific information about HTTP
		status events. Event objects are passed as parameters to event listeners.

		@param type       The type of the event. Event listeners can access this
						  information through the inherited `type`
						  property. There is only one type of HTTPStatus event:
						  `HTTPStatusEvent.HTTP_STATUS`.
		@param bubbles    Determines whether the Event object participates in the
						  bubbling stage of the event flow. Event listeners can
						  access this information through the inherited
						  `bubbles` property.
		@param cancelable Determines whether the Event object can be canceled.
						  Event listeners can access this information through the
						  inherited `cancelable` property.
		@param status     Numeric status. Event listeners can access this
						  information through the `status` property.
	**/
	public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false, status: number = 0, redirected: boolean = false)
	{
		super(type, bubbles, cancelable);

		this.__status = status;
		this.redirected = redirected;
	}

	public clone(): HTTPStatusEvent
	{
		var event = new HTTPStatusEvent(this.__type, this.__bubbles, this.__cancelable, this.__status, this.redirected);
		event.__target = this.__target;
		event.__currentTarget = this.__currentTarget;
		event.__eventPhase = this.__eventPhase;
		return event;
	}

	public toString(): string
	{
		return this.formatToString("HTTPStatusEvent", "type", "bubbles", "cancelable", "status", "redirected");
	}

	protected __init(): void
	{
		super.__init();
		this.__status = 0;
		this.redirected = false;
	}

	// Get & Set Methods

	/**
		The HTTP status code returned by the server. For example, a value of 404
		indicates that the server has not found a match for the requested URI.
		HTTP status codes can be found in sections 10.4 and 10.5 of the HTTP
		specification at [http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).


		If Flash Player or AIR cannot get a status code from the server, or if
		it cannot communicate with the server, the default value of 0 is passed to
		your code. A value of 0 can be generated in any player(for example, if a
		malformed URL is requested), and a value of 0 is always generated by the
		Flash Player plug-in when it is run in the following browsers, which do
		not pass HTTP status codes to the player: Netscape, Mozilla, Safari,
		Opera, and Internet Explorer for the Macintosh.
	**/
	public get status(): number
	{
		return this.__status;
	}
}
