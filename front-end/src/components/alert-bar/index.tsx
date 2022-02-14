import { Snackbar, Alert, AlertColor } from "@mui/material";

interface IAlertBarProps {
  show: boolean;
  severity: AlertColor;
  message: string;
  onDismiss?(): void;
  duration?: number;
}

const AlertBar = ({ show, severity, message, onDismiss, duration=6000 }: IAlertBarProps) => {
  return (
    <Snackbar open={show} autoHideDuration={duration} onClose={() => onDismiss && onDismiss()}>
      <Alert severity={severity}>{message}</Alert>
    </Snackbar>
  );
};

export default AlertBar;
