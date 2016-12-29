package <%= serviceBeanPkg %>;

import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.domino.services.ServiceException;
import com.ibm.domino.services.rest.RestServiceEngine;
import com.ibm.xsp.extlib.component.rest.CustomService;
import com.ibm.xsp.extlib.component.rest.CustomServiceBean;

/**
 * Class for the people endpoint CustomRestService.
 */
public class <%= propName %>ServiceBean extends CustomServiceBean {

	/**
	 * Enum of all available HTTP methods.
	 */
	public enum Methods {
		GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS, CONNECT, PATCH
	}

	private static final String contentType = "<%= type %>";

  /**
	 * @return methodsAllowed String[]
	 */
	private static String[] getMethodsAllowed() {
		return new String[] { "GET", "OPTIONS" };
	}

	@Override
	public void renderService( CustomService service, RestServiceEngine engine ) throws ServiceException {

		HttpServletRequest req = engine.getHttpRequest();
		HttpServletResponse res = engine.getHttpResponse();

		try {

			res.setHeader("Content-Type", <%= propName %>ServiceBean.contentType);
			PrintWriter out = new PrintWriter(res.getOutputStream());

			Methods reqMethod = Methods.valueOf(req.getMethod());
			switch (reqMethod) {
				case GET:
					<%= propName %>ServiceBean.doGet(req, res, out);
					break;
				case POST:
					<%= propName %>ServiceBean.doPost(req, res, out);
					break;
				case PUT:
					<%= propName %>ServiceBean.doPut(req, res, out);
					break;
				case DELETE:
					<%= propName %>ServiceBean.doDelete(req, res, out);
					break;
				case OPTIONS:
					<%= propName %>ServiceBean.doOptions(req, res, out);
					break;
				default:
					<%= propName %>ServiceBean.doUnHandled(req, res, out);
					break;
			}

			out.close();

		} catch (Exception e) {
			System.out.println(e.toString());
		}

	}

  /**
	 * GET requests.
	 *
	 * @param req HttpServletRequest
	 * @param res HttpServletResponse
	 * @param out PrintWriter
	 * @throws IOException
	 * @throws JsonException
	 */
	public static void doGet( HttpServletRequest req, HttpServletResponse res, PrintWriter out ) throws JsonException, IOException {
    // TODO: provide content
		out.println("{\"data\": \"Hello World! from the <%= propName %>ServiceBean %>\"}");
  }

  /**
	 * POST requests.
	 *
	 * @param req HttpServletRequest
	 * @param res HttpServletResponse
	 * @param out PrintWriter
	 */
	public static void doPost( HttpServletRequest req, HttpServletResponse res, PrintWriter out ) {
		// nothing yet
		doUnHandled(req, res, out);
	}

  /**
	 * PUT requests.
	 *
	 * @param req HttpServletRequest
	 * @param res HttpServletResponse
	 * @param out PrintWriter
	 */
	public static void doPut( HttpServletRequest req, HttpServletResponse res, PrintWriter out ) {
		// nothing yet
		doUnHandled(req, res, out);
	}

  /**
	 * DELETE requests.
	 *
	 * @param req HttpServletRequest
	 * @param res HttpServletResponse
	 * @param out PrintWriter
	 */
	public static void doDelete( HttpServletRequest req, HttpServletResponse res, PrintWriter out ) {
		// nothing yet
		doUnHandled(req, res, out);
	}

  /**
	 * Method for requests methods that are not implemented (e.g.- PATCH, TRACE,
	 * etc).
	 *
	 * @param req HttpServletRequest
	 * @param res HttpServletResponse
	 * @param out PrintWriter
	 */
	public static void doUnHandled( HttpServletRequest req, HttpServletResponse res, PrintWriter out ) {
		res.setStatus(405); // Method Not Allowed
		res.setHeader("Access-Control-Allow-Methods", Arrays.toString(getMethodsAllowed()));
	}

  /**
	 * Returns 200 OK with the Access-Control-Allow-Methods header and the
	 * Arrays.toString result of the String[] from getMethodsAllowed().
	 *
	 * @param req HttpServletRequest
	 * @param res HttpServletResponse
	 * @param out PrintWriter
	 */
	public static void doOptions( HttpServletRequest req, HttpServletResponse res, PrintWriter out ) {
		res.setStatus(200); // OK
		res.setHeader("Access-Control-Allow-Methods", Arrays.toString(getMethodsAllowed()));
	}

}
