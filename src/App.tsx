import { useEffect, useMemo, useState } from "react";

const targetDate = new Date("2026-05-03T10:30:00+05:30").getTime();

function padTwo(value: number) {
  return String(value).padStart(2, "0");
}

function buildICS() {
  const event = {
    title: "Engagement Ceremony",
    description: "Engagement Ceremony for Shreeja V Bhat and Adarsh S Srivatsa",
    location: "Shree Guru Residency Party Hall Mysuru",
    start: "20260503T053000Z",
    end: "20260503T163000Z",
  };

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Engagement Ceremony//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    `DTSTAMP:${event.start}`,
    `DTSTART:${event.start}`,
    `DTEND:${event.end}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function createDownloadLink() {
  const blob = new Blob([buildICS()], { type: "text/calendar;charset=utf-8" });
  return URL.createObjectURL(blob);
}

function App() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const icsUrl = useMemo(createDownloadLink, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoaded(true), 300);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    function updateCountdown() {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      setCountdown({ days, hours, minutes, seconds });
    }

    updateCountdown();
    const id = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(id);
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const sectionIds = ["hero", "details", "venue", "countdown"];
  const [activeSection, setActiveSection] = useState(0);

  const scrollToSection = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const updateActiveSection = () => {
      const positions = sectionIds.map((id) => {
        const element = document.getElementById(id);
        return element ? element.getBoundingClientRect().top : Infinity;
      });

      const closestIndex = positions.reduce(
        (bestIndex, current, currentIndex) => {
          const bestDistance = Math.abs(positions[bestIndex]);
          const currentDistance = Math.abs(current);
          return currentDistance < bestDistance ? currentIndex : bestIndex;
        },
        0,
      );

      setActiveSection(
        Math.max(0, Math.min(closestIndex, sectionIds.length - 1)),
      );
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  const isLastSection = activeSection >= sectionIds.length - 1;

  const FloatingNav = () => (
    <div className="floating-nav">
      <button
        className={`section-nav-btn ${isLastSection ? "up" : "down"}`}
        aria-label={isLastSection ? "Scroll to top" : "Scroll to next section"}
        onClick={() =>
          isLastSection
            ? scrollToSection(sectionIds[0])
            : scrollToSection(sectionIds[activeSection + 1])
        }
      >
        <svg viewBox="0 0 24 24">
          <polyline
            points={isLastSection ? "6 15 12 9 18 15" : "6 9 12 15 18 9"}
          />
        </svg>
      </button>
    </div>
  );

  return (
    <div className={`app ${isLoaded ? "loaded" : ""}`}>
      <div className={`loading-overlay ${isLoaded ? "hidden" : ""}`}>
        <div className="loader-spinner" />
        <p className="loader-text">Loading</p>
      </div>

      <section id="hero" className="hero">
        <img
          src={`${import.meta.env.BASE_URL}flourish.png`}
          alt=""
          className="hero-flourish top-left"
          aria-hidden="true"
        />
        <img
          src={`${import.meta.env.BASE_URL}flourish.png`}
          alt=""
          className="hero-flourish top-right"
          aria-hidden="true"
        />
        <img
          src={`${import.meta.env.BASE_URL}flourish.png`}
          alt=""
          className="hero-flourish bottom-left"
          aria-hidden="true"
        />
        <img
          src={`${import.meta.env.BASE_URL}flourish.png`}
          alt=""
          className="hero-flourish bottom-right"
          aria-hidden="true"
        />
        <img
          src={`${import.meta.env.BASE_URL}ganesha.png`}
          alt="Lord Ganesha"
          className="hero-ganesha"
        />
        <div className="hero-rings-wrapper">
          <div className="hero-rings-line left">
            <img
              src={`${import.meta.env.BASE_URL}gold_frame_divider_left.png`}
              alt=""
            />
          </div>
          <div className="hero-rings">
            <img
              src={`${import.meta.env.BASE_URL}love.png`}
              alt=""
              className="hero-rings-img"
            />
          </div>
          <div className="hero-rings-line right">
            <img
              src={`${import.meta.env.BASE_URL}gold_frame_divider_right.png`}
              alt=""
            />
          </div>
        </div>
        <p className="hero-subtitle">You are cordially invited to the</p>
        <h1 className="hero-title">Engagement Ceremony</h1>
        <h2 className="hero-names">
          <span className="name-left">Shreeja V Bhat</span>
          <span className="amp">&</span>
          <span className="name-right">Adarsh S Srivatsa</span>
        </h2>
        <p className="hero-hashtag">#Adreeja</p>
        <div className="hero-date-banner">
          <div className="date-text">MAY 3, 2026</div>
          <div className="day-text">Sunday</div>
        </div>
      </section>

      <section id="details">
        <div className="details reveal">
          <h3 className="section-title">The Ceremony</h3>
          <div className="detail-group reveal delay-1">
            <span className="detail-icon">
              <img
                src={`${import.meta.env.BASE_URL}calendar.png`}
                alt="Calendar"
                className="detail-icon-img"
              />
            </span>
            <p className="detail-label">Date</p>
            <p className="detail-value">
              3<sup>rd</sup> of May, 2026
            </p>
            <p className="detail-extra">Sunday</p>
          </div>
          <div className="detail-group reveal delay-2">
            <span className="detail-icon">🕓</span>
            <p className="detail-label">Time</p>
            <p className="detail-value">11 AM Onwards</p>
            <p className="detail-extra"></p>
          </div>
          <div className="detail-group reveal delay-3">
            <span className="detail-icon">📍</span>
            <p className="detail-label">Venue</p>
            <p className="detail-value">Hotel Shree Guru Residency</p>
            <p className="detail-extra">Mysuru</p>
          </div>
        </div>
      </section>

      <section id="venue" className="map-section">
        <h3 className="section-title reveal">The Venue</h3>
        <p className="section-subtitle reveal delay-1">
          Hotel Shree Guru Residency <br /> Mysuru
        </p>
        <div className="map-container reveal delay-2">
          <iframe
            className="map-embed"
            title="Shree Guru Residency Party Hall map"
            src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=Shree%20Guru%20Residency%20Party%20Hall%20Mysuru&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a
          href="https://maps.app.goo.gl/SUSYbeizE1s2HLzS9"
          className="directions-btn reveal delay-3"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Directions
        </a>
      </section>

      <section id="countdown" className="countdown-section">
        <h3 className="section-title reveal">Save the Date</h3>
        <div className="divider reveal delay-1" />
        <p className="section-subtitle reveal delay-2">
          Counting down to the celebration
        </p>
        <div className="countdown reveal delay-3">
          {[
            { label: "Days", value: countdown.days },
            { label: "Hours", value: countdown.hours },
            { label: "Minutes", value: countdown.minutes },
            { label: "Seconds", value: countdown.seconds },
          ].map((unit, idx) => (
            <>
              {idx > 0 && (
                <span className="countdown-colon" key={`colon-${idx}`}>
                  :
                </span>
              )}
              <div className="countdown-unit" key={unit.label}>
                <span className="countdown-label">{unit.label}</span>
                <div className="countdown-digits">
                  {padTwo(unit.value)
                    .split("")
                    .map((digit, index) => (
                      <div className="flip-card" key={index}>
                        <span className="digit">{digit}</span>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ))}
        </div>
        <button
          className="cal-btn reveal delay-4"
          onClick={openModal}
          aria-label="Add event to your calendar"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Add to Calendar
        </button>
      </section>
      <FloatingNav />

      {modalOpen && (
        <div
          className="cal-modal-backdrop open"
          role="dialog"
          aria-modal="true"
          aria-labelledby="calModalHeading"
          onClick={(event) =>
            event.target === event.currentTarget && closeModal()
          }
        >
          <div className="cal-modal">
            <button
              className="cal-modal-close"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <p className="cal-modal-eyebrow">Mark your calendar</p>
            <p className="cal-modal-title" id="calModalHeading">
              Save the Date
            </p>
            <p className="cal-modal-info">Engagement Ceremony</p>
            <p className="cal-modal-info">
              Shreeja V Bhat and Adarsh S Srivatsa
            </p>
            <p className="cal-modal-meta">3rd May 2026 · 10:30 AM – 10:00 PM</p>
            <p className="cal-modal-meta">
              Shree Guru Residency Party Hall Mysuru
            </p>
            <div className="cal-modal-divider" />
            <div className="cal-modal-options">
              <a
                className="cal-option-btn ics"
                href={icsUrl}
                download="engagement-ceremony.ics"
              >
                Download .ics
              </a>
            </div>
            <p className="cal-modal-note">
              A reminder will be added automatically. You can edit or remove the
              event later.
            </p>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>We look forward to celebrating with you ♥</p>
      </footer>
    </div>
  );
}

export default App;
