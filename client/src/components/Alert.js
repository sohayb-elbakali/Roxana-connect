import React, { useEffect } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { hideAlertMessage } from "../redux/modules/alerts";

const Alert = ({ alert, hideAlertMessage }) => {
  useEffect(() => {
    console.log("inside useEffect ", alert);
    if (alert.show) {
      console.log("showing the alert...");
      // Update to handle different toast types:
      const toastMethod =
        alert.type === "error"
          ? "error"
          : alert.type === "success"
          ? "success"
          : alert.type === "warning"
          ? "warning"
          : "info";
      toast[toastMethod](alert.msg);
      // Hide the alert after showing it
      hideAlertMessage();
    }
  });

  return <></>;
};

const mapStateToProps = (state) => {
  return {
    alert: state.alerts,
  };
};

export default connect(mapStateToProps, { hideAlertMessage })(Alert);
