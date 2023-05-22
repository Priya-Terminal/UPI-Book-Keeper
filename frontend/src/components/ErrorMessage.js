const ErrorMessage = ({ errorMsg }) =>
  errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>;

export default ErrorMessage;