import { useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  Search,
  UserCog,
  Download,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Messages.css';

interface Message {
  id: number;
  title: string;
  body: string;
  sender: string;
  date: string;
}

const messages: Message[] = [
  {
    id: 1,
    title: 'Enroll in Skill Development Courses',
    body: 'Centre for Professional Enhancement (CPE) brings a great opportunity to align your career and develop new skills...',
    sender: 'Administration',
    date: 'Aug 24, 2026',
  },
  {
    id: 2,
    title: 'Opening of Labs in Extended Hours',
    body: 'Dear Student, To facilitate the project-based learning and enhancement of practical learning, labs will be available...',
    sender: 'Administration',
    date: 'Aug 24, 2026',
  },
  {
    id: 3,
    title: 'RMS Ticket Number mt/Aug-26/13471 update',
    body: 'Dear Student your request of ticket number mt/Aug-26/13471 has been received and status: In Process...',
    sender: 'Administration',
    date: 'Aug 24, 2026',
  },
  {
    id: 4,
    title: 'RMS Ticket Number 5620029 update',
    body: 'Dear Student, The resolution of your request/query has been provided. Check your RMS reply...',
    sender: 'Administration',
    date: 'Aug 23, 2026',
  },
  {
    id: 5,
    title: 'RMS Ticket Number mt/Aug-26/13233 update',
    body: 'Dear Student your request of ticket number mt/Aug-26/13233 has been received and status: In Process...',
    sender: 'Administration',
    date: 'Aug 23, 2026',
  },
  {
    id: 6,
    title: 'RMS Ticket Number mt/Aug-26/12436 update',
    body: 'Dear Student your request of ticket number mt/Aug-26/12436 has been received and status: In Process...',
    sender: 'Administration',
    date: 'Aug 22, 2026',
  },
  {
    id: 7,
    title: 'Assignment',
    body: 'Dear Student, A new Academic Task is available in your Account (Check UMS to view attachment...',
    sender: 'Administration',
    date: 'Aug 22, 2026',
  },
  {
    id: 8,
    title: 'COMPETITIVE EVENT - CAPGEMINI INDIA PVT. LTD.',
    body: 'Dear Student, You are eligible for COMPETITIVE EVENT of CAPGEMINI INDIA PVT. LTD.. Date will be notified...',
    sender: 'Administration',
    date: 'Aug 21, 2026',
  },
  {
    id: 9,
    title: 'COMPETITIVE EVENT - CAPGEMINI INDIA PVT. LTD.',
    body: 'Dear Student, You are eligible for COMPETITIVE EVENT of CAPGEMINI INDIA PVT. LTD.. Date will be notified...',
    sender: 'Administration',
    date: 'Aug 21, 2026',
  },
  {
    id: 10,
    title:
      'Last date to complete the NPTEL Examination Registration Set-2 (4/8 weeks courses) - Term 26271',
    body: 'Dear Students, The last date to fill the NPTEL exam registration form and pay exam fees...',
    sender: 'Administration',
    date: 'Aug 21, 2026',
  },
  {
    id: 11,
    title: 'Enroll in Skill Development Courses',
    body: 'Centre for Professional Enhancement (CPE) brings a great opportunity to align your career and develop new skills...',
    sender: 'Administration',
    date: 'Aug 20, 2026',
  },
  {
    id: 12,
    title: 'Enroll in Skill Development Courses',
    body: 'Centre for Professional Enhancement (CPE) brings a great opportunity to align your career and develop new skills...',
    sender: 'Administration',
    date: 'Aug 20, 2026',
  },
  {
    id: 13,
    title: 'Infosys Springboard AI Courses form filling',
    body: 'Dear Student, This is a mandatory reminder regarding the completion of the certifications and course requirements...',
    sender: 'Administration',
    date: 'Aug 19, 2026',
  },
  {
    id: 14,
    title: 'Registration for Revenue Generation Model (RGM)',
    body: 'Dear Students, Revenue Generation Model (RGM) registrations for Term 26271 are now open for students...',
    sender: 'Administration',
    date: 'Aug 19, 2026',
  },
  {
    id: 15,
    title: 'Live Project - CAUSEWAY CREATIVE',
    body: 'Dear Student, You are eligible for Live Project of CAUSEWAY CREATIVE. Date will be notified...',
    sender: 'Administration',
    date: 'Aug 18, 2026',
  },
  {
    id: 16,
    title: 'Earn Your Own Fee – Revenue Generation Opportunity!',
    body: 'Dear Student, Are you interested in generating revenue and contributing towards your own fee...',
    sender: 'Administration',
    date: 'Aug 18, 2026',
  },
  {
    id: 17,
    title: 'Regarding Uploading of final report',
    body: 'Dear Student, since you are registered in course code CSE443 in current term 26271, thus...',
    sender: 'Administration',
    date: 'Aug 13, 2026',
  },
  {
    id: 18,
    title: 'RMS Survey',
    body: 'Dear student, We would be grateful if you could spare a few moments to share your thoughts...',
    sender: 'Administration',
    date: 'Aug 10, 2026',
  },
];

export default function Messages() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [lastMessageOpen, setLastMessageOpen] = useState(false);

  const filteredMessages = messages.filter((message) => {
    const text = `
      ${message.title}
      ${message.body}
      ${message.sender}
      ${message.date}
    `.toLowerCase();

    return text.includes(query.toLowerCase());
  });

  return (
    <div className="screen screen--no-nav messages-page">

      {/* Header */}
      <header className="messages-header">
        <button
          className="messages-header__back"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft
            size={24}
            color="#fff"
            strokeWidth={2.2}
          />
        </button>

        <h1>My Messages</h1>

        <button
          className="messages-header__calendar"
          aria-label="Calendar"
        >
          <CalendarDays
            size={22}
            color="#fff"
            strokeWidth={2}
          />
        </button>
      </header>

      {/* Search */}
      <div className="messages-search">
        <Search
          size={20}
          color="#999"
          strokeWidth={2}
        />

        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLastMessageOpen(false);
          }}
        />
      </div>

      {/* Messages */}
      <div className="messages-scroll">

        {filteredMessages.map((message) => {

          /*
           * Only the actual final message in the original list
           * should contain the Edit Profile / Install buttons.
           */
          const isActualLastMessage =
            message.id === messages[messages.length - 1].id;

          return (
            <div key={message.id}>

              <div
                className={`message-card ${
                  isActualLastMessage && lastMessageOpen
                    ? 'message-card--open'
                    : ''
                }`}
                onClick={() => {
                  if (isActualLastMessage) {
                    setLastMessageOpen((previous) => !previous);
                  }
                }}
              >

                {/* Heading */}
                <div className="message-card__title">
                  {message.title}
                </div>

                {/* Message preview */}
                <div className="message-card__body">
                  {message.body}
                </div>

                {/* Administration + Date */}
                <div className="message-card__top">
                  <span className="message-card__sender">
                    {message.sender}
                  </span>

                  <span className="message-card__date">
                    {message.date}
                  </span>
                </div>

              </div>

              {/* Actions appear only below the actual last message */}
              {isActualLastMessage && lastMessageOpen && (
                <div className="messages-actions">

                  {/* Edit Profile */}
                  <button
                    className="messages-action messages-action--edit"
                    onClick={() => navigate('/edit-profile')}
                  >
                    <UserCog size={19} />

                    <span>
                      Edit Profile
                    </span>
                  </button>

                  {/* Install LPU Touch */}
                  <button
                    className="messages-action messages-action--install"
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent('request-pwa-install')
                      );
                    }}
                  >
                    <Download size={19} />

                    <span>
                      Install LPU Touch
                    </span>
                  </button>

                </div>
              )}

            </div>
          );
        })}

        {/* No results */}
        {filteredMessages.length === 0 && (
          <div className="messages-empty">
            No messages found
          </div>
        )}

      </div>
    </div>
  );
}