package hupiat.scootio.server.core.controllers;

import java.util.NoSuchElementException;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ErrorController extends ResponseEntityExceptionHandler {

	private static final Logger LOGGER = Logger.getLogger(ErrorController.class.getSimpleName());

	@Override
	protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body, HttpHeaders headers,
			HttpStatusCode statusCode, WebRequest request) {
		LOGGER.log(Level.SEVERE, (String) body, ex);
		return super.handleExceptionInternal(ex, body, headers, statusCode, request);
	}

	// Internal error
	@ExceptionHandler(value = Exception.class)
	protected ResponseEntity<Object> handleInternalError(RuntimeException ex, WebRequest request) {
		return handleExceptionInternal(ex, "Technical error", new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR,
				request);
	}

	// Bad query
	@ExceptionHandler(value = { IllegalArgumentException.class, IllegalStateException.class, IllegalAccessError.class })
	protected ResponseEntity<Object> handleBadRequest(RuntimeException ex, WebRequest request) {
		return handleExceptionInternal(ex, "Malformed query or internal corruption, see for details : ",
				new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
	}

	// Not found
	@ExceptionHandler(value = { NoSuchElementException.class, AuthenticationException.class })
	protected ResponseEntity<Object> handleNotFoundResource(RuntimeException ex, WebRequest request) {
		return handleExceptionInternal(ex, "Requested resource not found", new HttpHeaders(), HttpStatus.NOT_FOUND,
				request);
	}
}