//@ts-ignore
import "./interviews.css";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  styled,
  Button,
  Box,
  Tooltip,
  Modal,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { IInterview } from "../../gql/interview/types";
import { useEffect, useState } from "react";
import { convertToSimpleDate } from "../../date-converter";
import { FcCancel } from "react-icons/fc";
import { ModalStyling } from "../../styles/modal";
import { useMutation } from "@apollo/react-hooks";
import { CANCEL_INTERVIEW } from "../../gql/interview/mutations";
import InterviewScheduler from "../interview-scheduler";

const StyledInterviewList = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

interface IInterviewsProps {
  interviews: IInterview[] | undefined;
  selectedDate: Date;
}

const Interviews = ({ selectedDate, interviews }: IInterviewsProps) => {
  const [dayInterviews, setDayInterviews] = useState<IInterview[]>([]);
  const [cancellingInterview, setCancellingInterview] =
    useState<boolean>(false);
  const [selectedInterview, setSelectedInterview] = useState<IInterview>();
  const [cancelInterview] = useMutation(CANCEL_INTERVIEW);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [alertSeverity, setAlertSeverity] = useState<"error" | "success">();
  const [alertMessage, setAlertMessage] = useState<string>();

  useEffect(() => {
    if (!interviews) return;
    setDayInterviews(
      interviews.filter(
        (i) => i.scheduledTime === convertToSimpleDate(selectedDate)
      )
    );
  }, [selectedDate, interviews]);

  const handleCancelInterview = () => {
    cancelInterview({
      variables: {
        id: selectedInterview!.id,
      },
    })
      .then(() => {
        setAlertMessage("Interview cancelled successfully");
        setAlertSeverity("success");
        setShowNotification(true);
        setCancellingInterview(false);
      })
      .catch((err) => {
        console.log(err);
        setAlertMessage("An error occured while cancelling interview");
        setAlertSeverity("error");
        setShowNotification(true);
        setCancellingInterview(false);
      });
  };

  return (
    <Grid item xs={12} md={6}>
      <Typography variant="h6" component="div">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>{selectedDate.toDateString()}</div>
          <div>
            <InterviewScheduler defaultDate={selectedDate} />
          </div>
        </div>
      </Typography>
      <StyledInterviewList>
        <List dense={false}>
          {dayInterviews.length > 0 ? (
            dayInterviews.map((interview) => {
              return (
                <ListItem>
                  <ListItemText
                    primary={interview.candidate.name}
                    secondary={
                      interview.candidate.email + " | " + interview.locationName
                    }
                  />
                  <Tooltip title="Cancel Interview">
                    <Box
                      sx={{ ml: 1 }}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedInterview(interview);
                        setCancellingInterview(true);
                      }}
                    >
                      <FcCancel size={20} />
                    </Box>
                  </Tooltip>
                </ListItem>
              );
            })
          ) : (
            <ListItem>
              <ListItemText primary="No interviews scheduled" />
            </ListItem>
          )}
        </List>
      </StyledInterviewList>
      <Modal
        open={cancellingInterview}
        onClose={() => setCancellingInterview(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyling}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{ marginBottom: 50 }}
          >
            <span>
              Cancel interview with {selectedInterview?.candidate.name}?
            </span>
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="error"
              onClick={handleCancelInterview}
            >
              Yes
            </Button>
            <Button
              variant="outlined"
              onClick={() => setCancellingInterview(false)}
            >
              No
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={() => setShowNotification(false)}
      >
        <Alert severity={alertSeverity}>{alertMessage}</Alert>
      </Snackbar>
    </Grid>
  );
};

export default Interviews;
