const setMessageLog = (span, message) => {
  span.log({
    message
  });
};

const setXHRRequestLogs = span => {
  setMessageLog(span, 'request_sent');
};

const setXHRResponseSuccessLogs = span => {
  setMessageLog(span, 'request_ok');
};

const setXHRResponseErrorLogs = span => {
  span.log({
    message: 'request_failed'
  });
};

export default {
  setXHRRequestLogs,
  setXHRResponseSuccessLogs,
  setXHRResponseErrorLogs
};
