package mk.ukim.finki.citex.handlers;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class RestErrorHandler {

	private final Logger log = LoggerFactory.getLogger(RestErrorHandler.class);

	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public Map<String, Object> processValidationError(
			MethodArgumentNotValidException ex) {
		BindingResult result = ex.getBindingResult();
		List<FieldError> fieldErrors = result.getFieldErrors();
		List<ObjectError> globalErrors = result.getGlobalErrors();

		Map<String, Object> errors = processFieldErrors(fieldErrors);

		errors.put("_objectErrors", processObjectErrors(globalErrors));
		log.error("Handled Error: ", ex);
		return errors;
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public Map<String, Object> constraintViolation(
			DataIntegrityViolationException ex) {
		Map<String, Object> errors = new HashMap<String, Object>();
		errors.put("_error", ex.getClass().getSimpleName());
		log.error("Handled Data Validation Error: ", ex);
		return errors;
	}

	@ExceptionHandler
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	@ResponseBody
	public String handle(HttpMessageNotReadableException e) throws IOException {
		e.printStackTrace();
		return e.getMessage();

	}

	private Map<String, Object> processFieldErrors(List<FieldError> fieldErrors) {
		Map<String, Object> errors = new HashMap<String, Object>();

		for (FieldError fieldError : fieldErrors) {
			String localizedErrorMessage = resolveLocalizedErrorMessage(fieldError);
			errors.put(fieldError.getField(), localizedErrorMessage);
		}

		return errors;
	}

	private Map<String, Object> processObjectErrors(
			List<ObjectError> fieldErrors) {
		Map<String, Object> errors = new HashMap<String, Object>();

		for (ObjectError fieldError : fieldErrors) {
			String localizedErrorMessage = resolveLocalizedErrorMessage(fieldError);
			errors.put(fieldError.getObjectName(), localizedErrorMessage);
		}
		if (errors.isEmpty()) {
			errors = null;
		}

		return errors;
	}

	private String resolveLocalizedErrorMessage(ObjectError fieldError) {
		// If the message was not found, return the most accurate field error
		// code instead.
		// You can remove this check if you prefer to get the default error
		// message.
		String[] fieldErrorCodes = fieldError.getCodes();
		String localizedErrorMessage = fieldErrorCodes[0];

		return localizedErrorMessage;
	}
}
