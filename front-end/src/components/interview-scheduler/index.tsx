import {
  Box,
  Button,
  Modal,
  Stack,
  Tooltip,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { MdOutlineEditCalendar } from "react-icons/md";
import { ModalStyling } from "../../styles/modal";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { QUERY_CANDIDATES } from "../../gql/candidate/queries";
import { ICandidateResult } from "../../gql/candidate/types";
import { SCHEDULE_INTERVIEW } from "../../gql/interview/mutations";
import { convertToSimpleDate } from "../../date-converter";

interface IInterviewSchedulerProps {
  defaultDate: Date;
}

interface IInterviewForm {
  candidate_id: number;
  location_name: string;
  scheduled_time: Date;
}

const InterviewScheduler = ({ defaultDate }: IInterviewSchedulerProps) => {
  const { data } = useQuery<ICandidateResult>(QUERY_CANDIDATES, {
    pollInterval: 500,
  });

  const [schedulingInterview, setSchedulingInterview] =
    useState<boolean>(false);
  const [form, setForm] = useState<IInterviewForm>({
    candidate_id: 0,
    location_name: "",
    scheduled_time: defaultDate,
  });

  const [scheduleInterview] = useMutation(SCHEDULE_INTERVIEW, {
    variables: {
      input: {
        candidate: form.candidate_id,
        scheduledTime: convertToSimpleDate(form.scheduled_time),
        locationName: form.location_name,
      },
    },
  });
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [alertSeverity, setAlertSeverity] = useState<"error" | "success">();
  const [alertMessage, setAlertMessage] = useState<string>();

  const handleScheduleInterview = () => {
    scheduleInterview()
      .then(() => {
        setAlertMessage("Interview scheduled successfully");
        setAlertSeverity("success");
        setShowNotification(true);
        setSchedulingInterview(false);
      })
      .catch((err) => {
        console.log(err);
        setAlertMessage("An error occured while scheduling interview");
        setAlertSeverity("error");
        setShowNotification(true);
        setSchedulingInterview(false);
      });
  };

  if (!data?.candidates) return null;

  return (
    <>
      <Tooltip title="Scehdule Interview">
        <Box
          style={{ cursor: "pointer", marginLeft: 10, color: "green" }}
          onClick={() => setSchedulingInterview(true)}
        >
          <MdOutlineEditCalendar size={20} />
        </Box>
      </Tooltip>
      <Modal
        open={schedulingInterview}
        onClose={() => {
          setSchedulingInterview(false);
          setForm({
            candidate_id: 0,
            location_name: "",
            scheduled_time: defaultDate,
          });
        }}
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
            <span>Schdule interview</span>
          </Typography>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Candidate</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={form.candidate_id}
                label="Candidate"
                onChange={(e) => {
                  const id = parseInt(e.target.value.toString());
                  setForm({ ...form, candidate_id: id });
                }}
              >
                {data.candidates.map((candidate) => {
                  return (
                    <MenuItem value={candidate.id}>{candidate.name}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Date"
                inputFormat="MM/dd/yyyy"
                value={form.scheduled_time}
                onChange={(e) => setForm({ ...form, scheduled_time: e! })}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <TextField
              id="standard-basic"
              label="Location"
              variant="standard"
              fullWidth
              value={form.location_name}
              onChange={(e) =>
                setForm({ ...form, location_name: e.target.value })
              }
            />
          </Box>
          <Stack direction="row" spacing={2} style={{ marginTop: 50 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleScheduleInterview}
            >
              Schedule
            </Button>
            <Button
              variant="outlined"
              onClick={() => setSchedulingInterview(false)}
            >
              Cancel
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
    </>
  );
};

export default InterviewScheduler;
