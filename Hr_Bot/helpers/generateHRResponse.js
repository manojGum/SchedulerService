const generateHRResponse = (intent) => {
  switch (intent) {
    case "grating":
      return "Hello there! How can I assist you?";
    case "vacancy":
      return "We currently have open positions for developers and marketers. Which one are you interested in?";
    case "developer":
      return "Great! Can you please provide your resume and any relevant work experience?";
    case "marketer":
      return "Excellent! Can you please provide your resume and any relevant work experience?";
    case "apply":
      return "Please visit our website to view our current job openings and apply online. Good luck!";
    case "leave":
      return "You can submit a leave request through our HR portal or by speaking with your manager. Please provide your manager with at least two weeks notice.";
    case "vacation":
      return "You can apply for vacation by visiting our HR portal and filling out the application form.";
    case "salary":
      return "Your salary information is confidential and can only be shared with you by your manager. Please contact your manager for more information.";
    case "policies":
      return "You can find our company policies on our HR portal. If you have any questions, please contact HR.";
    case "training":
      return "You can find a list of available training programs on our HR portal. If you have any questions, please contact HR.";
    case "thanks":
      return "You are welcome. Have a great day!";

    default:
      return "I am sorry, I did not understand your request. Please try again.";
  }
};

module.exports = { generateHRResponse };
