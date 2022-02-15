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
  AlertColor,
} from "@mui/material";
import { useEffect, useState } from "react";
import { BsCalendarPlus } from "react-icons/bs";
import { ModalStyling } from "../../styles/modal";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { QUERY_CANDIDATES } from "../../gql/candidate/queries";
import { ICandidateResult } from "../../gql/candidate/types";
import {
  SCHEDULE_INTERVIEW,
  UPDATE_INTERVIEW,
} from "../../gql/interview/mutations";
import { convertToSimpleDate } from "../../date-converter";
import AlertBar from "../alert-bar";
import { DateTimePicker } from "@mui/lab";
import { IInterview } from "../../gql/interview/types";

interface IInterviewSchedulerProps {
  defaultDate: Date;
  editingInterview: boolean;
  selectedInterview?: IInterview;
  onDismiss(): void;
}

interface IInterviewForm {
  candidate_id: string;
  location_name: string;
  scheduled_time: Date;
}

const InterviewScheduler = ({
  defaultDate,
  selectedInterview,
  editingInterview,
  onDismiss,
}: IInterviewSchedulerProps) => {
  const { data } = useQuery<ICandidateResult>(QUERY_CANDIDATES, {
    pollInterval: 500,
  });

  const [schedulingInterview, setSchedulingInterview] =
    useState<boolean>(false);
  const [form, setForm] = useState<IInterviewForm>({
    candidate_id: "",
    location_name: "",
    scheduled_time: defaultDate,
  });

  const [scheduleInterview] = useMutation(SCHEDULE_INTERVIEW, {
    variables: {
      input: {
        candidate: form.candidate_id,
        scheduledTime: form.scheduled_time,
        locationName: form.location_name,
      },
    },
  });

  const [updateInterview] = useMutation(UPDATE_INTERVIEW, {
    variables: {
      id: selectedInterview?.id,
      scheduledTime: form.scheduled_time,
      locationName: form.location_name,
    },
  });

  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [candidateName, setCandidateName] = useState<string>("");

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

  const handleUpdateInterview = () => {
    updateInterview()
      .then(() => {
        setAlertMessage("Interview updated successfully");
        setAlertSeverity("success");
        setShowNotification(true);
        setSchedulingInterview(false);
        onDismiss();
      })
      .catch((err) => {
        console.log(err);
        setAlertMessage("An error occured while updating interview");
        setAlertSeverity("error");
        setShowNotification(true);
        setSchedulingInterview(false);
        onDismiss();
      });
  };

  useEffect(() => {
    if (editingInterview && selectedInterview) {
      const { candidate, scheduledTime, locationName } = selectedInterview;
      setForm({
        candidate_id: candidate.id,
        scheduled_time: scheduledTime,
        location_name: locationName,
      });
    }
  }, [editingInterview]);

  useEffect(() => {
    setForm({...form, scheduled_time: defaultDate})
  }, [defaultDate])

  if (!data?.candidates) return null;

  return (
    <>
      <Tooltip title="Schedule Interview">
        <Box
          style={{ cursor: "pointer", marginLeft: 10, color: "green" }}
          onClick={() => setSchedulingInterview(true)}
        >
          <BsCalendarPlus size={20} />
        </Box>
      </Tooltip>
      <Modal
        open={schedulingInterview || editingInterview}
        onClose={() => {
          setSchedulingInterview(false);
          setForm({
            candidate_id: "",
            location_name: "",
            scheduled_time: defaultDate,
          });
          onDismiss();
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
              {editingInterview ? (
                <TextField
                  disabled
                  label="Candidate"
                  defaultValue={
                    data.candidates.filter(
                      (c) => c.id === selectedInterview?.candidate.id
                    )[0]?.name
                  }
                />
              ) : (
                <>
                  <InputLabel id="candidate-select-label">Candidate</InputLabel>
                  <Select
                    labelId="candidate-select-label"
                    id="candidate-select"
                    value={form.candidate_id}
                    label="Candidate"
                    onChange={(e) => {
                      setForm({ ...form, candidate_id: e.target.value });
                    }}
                  >
                    {data.candidates.map((candidate) => {
                      return (
                        <MenuItem key={candidate.id} value={candidate.id}>
                          {candidate.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </>
              )}
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label="DateTimePicker"
                value={form.scheduled_time}
                minDate={new Date()}
                onChange={(newValue) => {
                  newValue && setForm({ ...form, scheduled_time: newValue });
                }}
                minutesStep={15}
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
              color={editingInterview ? 'primary' : 'success'}
              disabled={!form.candidate_id || !form.scheduled_time || !form.location_name}
              onClick={
                editingInterview
                  ? handleUpdateInterview
                  : handleScheduleInterview
              }
            >
             { editingInterview ? 'Update' : 'Schedule' }
            </Button>
            <Button
              variant="outlined"
              onClick={() => (onDismiss(), setSchedulingInterview(false))}
            >
              Cancel
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
    </>
  );
};

export default InterviewScheduler;
