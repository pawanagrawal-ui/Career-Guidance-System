Campus Connect – Alumni Mentorship & Career Guidance System
Campus Connect is a responsive frontend web application that connects students with alumni mentors. Students can discover mentors, book guidance sessions, save profiles, track career goals, explore resources, join events and rate completed sessions, all from one place.
Demo notice: This is a frontend-only demo. Mentors, bookings, logins and registrations are simulated. All data is saved only in the user's own browser.
Problem Statement
Many students do not know how to prepare for interviews, build a resume, choose a career path or decide on higher studies. Alumni have already walked this path, but there is rarely an easy way to reach them. Campus Connect bridges that gap by giving students a simple platform to find and learn from graduates who were once in their seat.
Features
Find a Mentor
Search by name, career, company, skill or topic
Filter by career field, guidance topic, meeting format and availability
Clear all filters with one click and see a live count of matching mentors
Mentor cards show role, company, class year, short bio, topics, rating and availability
Personalised "Suggested for you" hints based on the student's goals and saved items
View profile and Save mentor actions on every card
Student Dashboard
Upcoming sessions with status (e.g. Accepted) and the option to cancel
Saved mentors list for quick access
Career goals & action items with add, complete and remove options
Progress bar showing the percentage of completed action items
Career Resources
Searchable library of checklists, templates, guides and videos
Category filter (Resumes, Interviews, Internships, Portfolios, Career exploration)
Examples: one-page resume checklist, STAR-method interview guide, internship guide, portfolio case-study walkthrough
Events
Alumni talks, open Q&A sessions and mock interview nights
Online and in-person formats with a Register option
Feedback & Progress
Rate completed sessions (1–5 stars) and leave an optional comment
Progress summary linked to the dashboard action items
How It Works
Browse alumni by career, skill or topic
Request a session by choosing a topic, format and time, and adding a short note
Meet and grow by talking it through, rating the session and tracking action items
Tech Stack
Technology
Purpose
HTML5
Page structure and semantic layout
CSS3
Styling and responsive design
JavaScript (Vanilla)
Search, filters, dashboard logic and interactivity
Browser Local Storage
Saving user data in the browser (no backend)
Project Structure
Career-Guidance-System/
├── index.html    # Page markup and sections
├── style.css     # Styles and responsive layout
├── script.js     # Application logic and interactivity
└── README.md     # Project documentation
Getting Started
Clone the repository
git clone https://github.com/pawanagrawal-ui/Career-Guidance-System.git
Open the project folder
cd Career-Guidance-System
Run the project
Double-click index.html to open it in your browser, or
Use the Live Server extension in VS Code (runs at http://127.0.0.1:5500/index.html)
No installation or build step is needed.
Limitations
No real backend or database; data lives in the browser's local storage
Mentors, sessions, logins and registrations are sample data used for demonstration
Clearing browser data will reset the dashboard
Future Improvements
Backend with a database (Node.js / Firebase) for real accounts and bookings
Secure login for students and alumni
Real-time chat or video-call integration
Email notifications and calendar sync for sessions
Admin panel to verify and manage alumni profiles
License
This project was created for academic purposes. Add a license of your choice (for example, MIT) if you wish to share it 
