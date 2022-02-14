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
  AlertColor,
} from "@mui/material";
import { IInterview } from "../../gql/interview/types";
import { useEffect, useState } from "react";
import { BsCalendarX, BsCalendarCheck } from "react-icons/bs";
import { ModalStyling } from "../../styles/modal";
import { useMutation } from "@apollo/react-hooks";
import { CANCEL_INTERVIEW } from "../../gql/interview/mutations";
import InterviewScheduler from "../interview-scheduler";
import AlertBar from "../alert-bar";

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
  const [editingInterview, setEditingInterview] = useState<boolean>(false);
  const [selectedInterview, setSelectedInterview] = useState<IInterview>();
  const [cancelInterview] = useMutation(CANCEL_INTERVIEW);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
  const [alertMessage, setAlertMessage] = useState<string>("");

  useEffect(() => {
    if (!interviews) return;
    setDayInterviews(
      interviews.filter(
        (i) =>
          new Date(i.scheduledTime).toISOString().split("T")[0] ===
          selectedDate.toISOString().split("T")[0]
      )
    );
  }, [selectedDate, interviews]);

  const getInterviewTime = (scheduledTime: Date): string => {
    var hours = new Date(scheduledTime).getHours();
    const minutes = new Date(scheduledTime).getMinutes();
    const am_pm = hours >= 12 ? "pm" : "am";
    hours = hours > 12 ? hours - 12 : hours;
    return `${hours}:${minutes}${am_pm}`;
  };

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
            <InterviewScheduler
              editingInterview={editingInterview}
              defaultDate={selectedDate}
              selectedInterview={selectedInterview}
              onDismiss={() => setEditingInterview(false)}
            />
          </div>
        </div>
      </Typography>
      <StyledInterviewList>
        <List dense={false}>
          {dayInterviews.length > 0 ? (
            dayInterviews.map((interview) => {
              return (
                <ListItem key={interview.id}>
                  <ListItemText
                    primary={
                      interview.candidate.name +
                      " - " +
                      getInterviewTime(interview.scheduledTime)
                    }
                    secondary={
                      interview.candidate.email + " | " + interview.locationName
                    }
                  />
                  <Tooltip color="black" title="Modify Interview">
                    <Box
                      sx={{ ml: 1 }}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedInterview(interview);
                        setEditingInterview(true);
                      }}
                    >
                      <BsCalendarCheck size={20} />
                    </Box>
                  </Tooltip>
                  <Tooltip color="red" title="Cancel Interview">
                    <Box
                      sx={{ ml: 1 }}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedInterview(interview);
                        setCancellingInterview(true);
                      }}
                    >
                      <BsCalendarX size={20} />
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
      <AlertBar
        show={showNotification}
        severity={alertSeverity}
        message={alertMessage}
        onDismiss={() => setShowNotification(false)}
      />
    </Grid>
  );
};

export default Interviews;
