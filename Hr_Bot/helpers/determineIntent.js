const determineIntent = (text) => {
  const message = text.toLowerCase();
  if (message.includes("hello") || message.includes("hi")) {
    return "grating";
  } else if (message.includes("vacancy") || message.includes("job")) {
    return "vacancy";
  } else if (message.includes("developer")) {
    return "developer";
  } else if (message.includes("marketer")) {
    return "marketer";
  } else if (message.includes("apply") || message.includes("job application")) {
    return "apply";
  } else if (message.includes("leave")) {
    return "leave";
  } else if (message.includes("vacation")) {
    return "vacation";
  } else if (message.includes("salary")) {
    return "salary";
  } else if (message.includes("policies")) {
    return "policies";
  } else if (message.includes("training")) {
    return "training";
  } else if (message.includes("thank you") || message.includes("thanks")) {
    return "thanks";
  } else {
    return "unknown";
  }
};
module.exports = { determineIntent };
