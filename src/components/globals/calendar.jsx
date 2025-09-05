import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { formatDate } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField
} from "@mui/material";
import Header from "../scenes/Header";
import { tokens } from "../../theme";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [currentEvents, setCurrentEvents] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];
    setCurrentEvents(storedEvents);
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(currentEvents));
  }, [currentEvents]);

  const handleDateClick = (selected) => {
    setSelectedDateInfo(selected);
    setNewEventTitle("");
    setOpenAddModal(true);
  };

  const handleAddEvent = () => {
    if (newEventTitle.trim() && selectedDateInfo) {
      const calendarApi = selectedDateInfo.view.calendar;
      calendarApi.unselect();
      calendarApi.addEvent({
        id: `${selectedDateInfo.dateStr}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDateInfo.startStr,
        end: selectedDateInfo.endStr,
        allDay: selectedDateInfo.allDay,
      });
      setOpenAddModal(false);
    }
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setOpenDeleteModal(true);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      selectedEvent.remove();
      setOpenDeleteModal(false);
    }
  };

  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events.map(e => ({
              id: e.id,
              title: e.title,
              start: e.start,
              end: e.end,
              allDay: e.allDay
            })))}
            initialEvents={JSON.parse(localStorage.getItem("calendarEvents")) || []}
          />
        </Box>
      </Box>

      {/* ADD EVENT MODAL */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            fullWidth
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddEvent}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE EVENT MODAL */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the event '{selectedEvent?.title}'?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteEvent}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;
