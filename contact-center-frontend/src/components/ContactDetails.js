import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Chip,
  IconButton,
  FormControl,
  MenuItem,
  Select,
  Collapse,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Mustache from 'mustache';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import API from '../api';

const ContactDetails = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [assignedUser, setAssignedUser] = useState('');
  const [contact, setContact] = useState(null);
  const [note, setNote] = useState('');
  const [contacted, setContacted] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContact, setUpdatedContact] = useState({});
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loggedInUserFullName, setLoggedInUserFullName] = useState('Unknown User');
  const [expandedNotes, setExpandedNotes] = useState({});
  const [emailSubject, setEmailSubject] = useState('');

  const toggleNoteExpansion = (index) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    API.fetchCurrentUser()
      .then((response) => {
        setLoggedInUserFullName(response.data.fullName);
      })
      .catch(() => setLoggedInUserFullName('Unknown User'));
  }, []);

  useEffect(() => {
    API.fetchContact(id)
      .then((response) => {
        setContact(response.data);
        setUpdatedContact({
          name: response.data.name,
          companyName: response.data.companyName,
          phone: response.data.phone,
          email: response.data.email,
          doNotCall: response.data.doNotCall,
        });
        setAssignedUser(response.data.assignedTo?._id || '');
      })
      .catch((error) => console.error('Error fetching contact:', error));
  }, [id]);

  useEffect(() => {
    API.fetchUsers()
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    API.fetchEmailTemplates()
      .then((response) => setTemplates(response.data))
      .catch((error) => console.error('Error fetching templates:', error));
  }, []);

  const handleAssignUser = () => {
    API.assignContact(contact._id, { userId: assignedUser })
      .then((response) => {
        setContact(response.data);
      })
      .catch((error) => console.error('Error assigning user:', error));
  };

  const handleToggleDoNotCall = () => {
    const updatedDoNotCall = !updatedContact.doNotCall;
    setUpdatedContact((prev) => ({ ...prev, doNotCall: updatedDoNotCall }));

    API.updateContact(id, { doNotCall: updatedDoNotCall })
      .then(() => {
        setContact((prev) => ({ ...prev, doNotCall: updatedDoNotCall }));
      })
      .catch((error) => console.error('Error updating Do Not Call:', error));
  };

  const handleSaveContact = () => {
    API.updateContact(id, {
      name: updatedContact.name,
      companyName: updatedContact.companyName,
      phone: updatedContact.phone,
      email: updatedContact.email,
    })
      .then((response) => {
        setContact(response.data);
        setIsEditing(false);
      })
      .catch((error) => console.error('Error saving contact:', error));
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    API.addNote(id, { text: note, contacted })
      .then((response) => {
        setContact((prev) => ({
          ...prev,
          notes: response.data.notes,
        }));
        setNote('');
        setContacted(false);
      })
      .catch((error) => console.error('Error adding note:', error));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates.find((t) => t._id === templateId);
    setSelectedTemplate(templateId);
    if (template && contact) {
      const rendered = Mustache.render(template.content, {
        contact,
        user: { fullName: loggedInUserFullName },  // Include user details
      });
      setEmailContent(rendered);
      setEmailSubject(template.subject || '');
    }
  };

  const handleSendEmail = () => {
    if (!selectedTemplate || !emailContent.trim()) {
      alert('Please select a template and enter email content.');
      return;
    }

    const formData = new FormData();
    formData.append('subject', emailSubject);
    formData.append('content', emailContent);
    if (selectedFile) {
      formData.append('attachment', selectedFile);
    }

    API.sendEmail(contact._id, formData)
      .then(() => {
        setContact((prev) => ({
          ...prev,
          notes: [
            ...prev.notes,
            {
              text: `Email sent: "${emailSubject}"`,
              content: emailContent,
              date: new Date(),
              contacted: false,
              createdBy: loggedInUserFullName,
              type: 'email',
            },
          ],
        }));
        alert('Email sent successfully');
      })
      .catch((error) => console.error('Error sending email:', error));
  };

  if (!contact) return <div>Loading...</div>;

  return (
    <Container style={{ marginTop: '2rem' }}>
      {/* Full Width Card for Contact Details and Assign Contact */}
      <Card style={{ marginBottom: '2rem' }}>
      <CardContent>
  <Grid container spacing={2}>
    {/* Left Column: Contact Details */}
    <Grid item xs={12} md={6}>
      {isEditing ? (
        <>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={updatedContact.name || ''}
            onChange={(e) => setUpdatedContact({ ...updatedContact, name: e.target.value })}
          />
          <TextField
            label="Company Name"
            fullWidth
            margin="normal"
            value={updatedContact.companyName || ''}
            onChange={(e) => setUpdatedContact({ ...updatedContact, companyName: e.target.value })}
          />
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            value={updatedContact.phone || ''}
            onChange={(e) => setUpdatedContact({ ...updatedContact, phone: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={updatedContact.email || ''}
            onChange={(e) => setUpdatedContact({ ...updatedContact, email: e.target.value })}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={updatedContact.doNotCall || false}
                onChange={handleToggleDoNotCall}
              />
            }
            label="Do Not Call"
          />
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '1rem' }}
            onClick={handleSaveContact}
            fullWidth
          >
            Save Changes
          </Button>
        </>
      ) : (
        <>
          <Typography variant="subtitle1" style={{ marginBottom: '0.3rem' }}>{contact.name}</Typography>
          <Typography variant="subtitle1" style={{ marginBottom: '0.3rem' }}>{contact.companyName}</Typography>
          <Typography variant="subtitle1" style={{ marginBottom: '0.3rem' }}>{contact.phone}</Typography>
          <Typography variant="subtitle2">{contact.email}</Typography>
        </>
      )}
    </Grid>

    {/* Right Column: Chip, Edit, and Assign Contact */}
    <Grid item xs={12} md={6}>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '40px' }}>
        <FormControl fullWidth>
          <Select value={assignedUser} onChange={(e) => setAssignedUser(e.target.value)}>
            <MenuItem value="">Unassigned</MenuItem>
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.fullName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleAssignUser}>
          Assign
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        {contact.doNotCall && (
          <Chip label="Do Not Call" color="error" />
        )}
        <IconButton onClick={() => setIsEditing(true)}>
          <EditIcon />
        </IconButton>
      </div>


    </Grid>
  </Grid>
</CardContent>
      </Card>

      {/* Columns for Notes and Email */}
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
  <div style={{ position: 'sticky', top: '80px' }}>
    {/* Add Note Card */}
    <Card style={{ marginBottom: '2rem' }}>
      <CardContent>
        <Typography variant="h6">Add Note</Typography>
        <TextField
          label="Add Note"
          fullWidth
          multiline
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ marginTop: '1rem' }}
        />
        <FormControlLabel
          control={<Checkbox checked={contacted} onChange={(e) => setContacted(e.target.checked)} />}
          label="Customer Contacted"
        />
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: '1rem' }}
          onClick={handleAddNote}
          fullWidth
        >
          Add Note
        </Button>
      </CardContent>
    </Card>

    {/* Email Customer Card */}
    <Card>
      <CardContent>
        <Typography variant="h6" style={{ marginBottom: '1rem' }}>Email Customer</Typography>
        
        {/* Template Selector */}
        <FormControl fullWidth style={{ marginBottom: '1rem' }}>
          <Select value={selectedTemplate} onChange={(e) => handleTemplateSelect(e.target.value)}>
            <MenuItem value="">Select a Template</MenuItem>
            {templates.map((template) => (
              <MenuItem key={template._id} value={template._id}>
                {template.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Subject Field */}
        <TextField
          label="Email Subject"
          fullWidth
          margin="normal"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
        />

        {/* Quill Editor */}
        <Typography variant="h6" style={{ marginBottom: '0.5rem' }}>Email Content</Typography>
        <ReactQuill
          theme="snow"
          value={emailContent}
          onChange={setEmailContent}
          style={{ height: '200px', marginBottom: '1.5rem' }}
        />

        {/* File Attachment */}
        <input type="file" onChange={handleFileChange} style={{ marginTop: '1rem' }} />

        <Button
          variant="contained"
          color="secondary"
          style={{ marginTop: '1.5rem' }}
          fullWidth
          onClick={handleSendEmail}
        >
          Send Email
        </Button>
      </CardContent>
    </Card>
  </div>
</Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent style={{ flex: 1 }}>
              <Typography variant="h6">Notes</Typography>
              <List style={{ flex: 1, overflowY: 'auto' }}>
  {contact.notes?.slice().reverse().map((note, index) => (
    <ListItem
  key={index}
  style={{
    backgroundColor: note.type === 'email' ? 'yellow' : note.contacted ? 'lightgreen' : 'inherit',
    flexDirection: 'column', // Ensure content flows vertically
    alignItems: 'flex-start',
  }}
>
  <Grid container alignItems="center" spacing={1}>
    {/* Note Text and Added By Info */}
    <Grid item xs={11}>
      <ListItemText
        primary={note.text}
        secondary={
          <Typography variant="caption" color="textSecondary">
            Added by {note.createdBy} on {new Date(note.date).toLocaleString()}
          </Typography>
        }
      />
    </Grid>

    {/* Expand/Collapse Icon */}
    {note.type === 'email' && (
      <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={() => toggleNoteExpansion(index)} size="small">
          {expandedNotes[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Grid>
    )}
  </Grid>

  {/* Email Content Collapse Section */}
  {note.type === 'email' && expandedNotes[index] && (
    <Collapse in={expandedNotes[index]} style={{ width: '100%', marginTop: '0.5rem' }}>
      <div
        style={{ paddingLeft: '16px' }}
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
    </Collapse>
  )}
</ListItem>
  ))}
</List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactDetails;