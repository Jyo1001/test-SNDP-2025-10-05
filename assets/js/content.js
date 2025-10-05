import { safe } from "./util.js";

export const CONTENT = {
  about: {
    paragraphs: [
      "Sree Narayana Dharma Paripalana (SNDP) Yogam is a social and religious organisation founded in May 1903 at Aruvippuram in the former princely state of Travancore to spread the egalitarian teachings of Sree Narayana Guru.",
      "The Yogam works mainly among Kerala's Ezhava community, advocating education, organised temple management, and cooperative enterprise as instruments of social uplift. Headquartered in Kollam, it administers an extensive network of schools, colleges, hospitals, and industrial ventures across the state."
    ],
    highlights: [
      { label: "Founders", value: "Sree Narayana Guru, Dr. Padmanabhan Palpu, Kumaran Asan" },
      { label: "Headquarters", value: "Kollam, Kerala, India" },
      { label: "Motto", value: "One caste, one religion, one God, for humankind" }
    ]
  },
  guru: {
    paragraphs: [
      "Sree Narayana Guru (1855–1928) was a philosopher, saint, and social reformer from Kerala who challenged caste-based exclusion through peaceful reform.",
      "He consecrated a Shiva idol at Aruvippuram in 1888, established temples open to all castes, and founded schools to promote modern education. His message of non-violence, self-improvement, and universal brotherhood remains central to SNDP Yogam's vision."
    ],
    quote: "One caste, one religion, one God, for humankind"
  },
  history: {
    timeline: [
      { year: "1855", detail: "Birth of Narayana Guru at Chempazhanthy near Thiruvananthapuram." },
      { year: "1888", detail: "Guru consecrates a Shiva temple at Aruvippuram, a symbolic act against caste restrictions on temple entry." },
      { year: "1903", detail: "SNDP Yogam registered as a charitable society to organise followers of Guru's teachings." },
      { year: "1904", detail: "Poet Kumaran Asan becomes the first general secretary, framing the Yogam's early programmes." },
      { year: "1928", detail: "Passing of Sree Narayana Guru; the Yogam expands its educational and cooperative initiatives." }
    ],
    paragraphs: [
      "SNDP Yogam grew rapidly in the early twentieth century, organising branch unions (shakhas) across Travancore and Cochin to coordinate temple reforms and literacy campaigns.",
      "Post-independence, the Yogam diversified into colleges, hospitals, and industrial cooperatives, retaining its reformist ethos while serving a statewide membership base."
    ]
  },
  unit9: {
    paragraphs: [
      "Unit 9 operates as a local branch within the wider SNDP Yogam federation, following the standard shakha structure described in Yogam records.",
      "Members coordinate temple festivals, scholarship drives, and relief initiatives in Kollam, echoing the Yogam's emphasis on community-based uplift and voluntary service."],
    focus: [
      { label: "Membership", value: "Open to devotees and well-wishers aligned with the Guru's ideals." },
      { label: "Activities", value: "Temple stewardship, cultural programmes, education support, and microfinance." },
      { label: "Service Area", value: "Neighbourhoods across central Kollam." }
    ]
  },
  programs: {
    paragraphs: [
      "According to SNDP Yogam's published activities, the organisation runs educational institutions from primary schools to colleges, along with industrial training centres and hospitals.",
      "The Yogam also manages cooperative societies, credit unions, and self-help groups that provide financial services and employment support to its members." ],
    initiatives: [
      "Educational trusts and colleges in Kerala's major districts.",
      "Temple administration boards promoting inclusive worship.",
      "Welfare programmes for students, women, and elderly members.",
      "Cooperative ventures in coir, dairy, and small-scale industries." ],
    upcomingHeading: "Upcoming community programmes"
  },
  faq: {
    items: [
      {
        q: "What is the core aim of SNDP Yogam?",
        a: "To uphold Sree Narayana Guru's ideals of social equality, spiritual progress, and self-reliance among Kerala's marginalised communities."
      },
      {
        q: "Who can join a local unit?",
        a: "Membership is generally open to devotees and supporters who agree to the Yogam's constitution and participate in branch activities."
      },
      {
        q: "How does the Yogam fund its initiatives?",
        a: "Funding comes from member subscriptions, donations, income from institutions, and cooperative enterprises managed under the Yogam." },
      {
        q: "What is the significance of the Guru's motto?",
        a: "The motto \"One caste, one religion, one God, for humankind\" summarises Narayana Guru's call for equality and universal brotherhood beyond caste barriers." }
    ]
  }
};

const paraHTML = (text) => `<p>${safe(text)}</p>`;
const factHTML = ({ label, value }) => `<li><strong>${safe(label)}:</strong> ${safe(value)}</li>`;

export const renderStaticContent = (content, events = []) => {
  const fill = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };

  if (content.about) {
    fill(
      "about",
      `<article class="article">${content.about.paragraphs.map(paraHTML).join("")}` +
        (content.about.highlights
          ? `<ul class="fact-list">${content.about.highlights.map(factHTML).join("")}</ul>`
          : "") +
        `</article>`
    );
  }

  if (content.guru) {
    fill(
      "guru",
      `<article class="article">${content.guru.paragraphs.map(paraHTML).join("")}` +
        (content.guru.quote
          ? `<blockquote class="quote">${safe(content.guru.quote)}</blockquote>`
          : "") +
        `</article>`
    );
  }

  if (content.history) {
    fill(
      "history",
      `<article class="article">` +
        `<ul class="timeline">${content.history.timeline
          .map((item) => `<li><span class="year">${safe(item.year)}</span><span>${safe(item.detail)}</span></li>`)
          .join("")}</ul>` +
        content.history.paragraphs.map(paraHTML).join("") +
        `</article>`
    );
  }

  if (content.unit9) {
    fill(
      "unit9",
      `<article class="article">${content.unit9.paragraphs.map(paraHTML).join("")}` +
        (content.unit9.focus
          ? `<ul class="fact-list">${content.unit9.focus.map(factHTML).join("")}</ul>`
          : "") +
        `</article>`
    );
  }

  if (content.programs) {
    const eventsHTML = events.length
      ? `<div class="table-wrap"><table class="table"><thead><tr><th>Date</th><th>Programme</th><th>Location</th><th>Notes</th></tr></thead><tbody>${events
          .map(
            (ev) =>
              `<tr><td>${safe(ev.date)}</td><td>${safe(ev.title)}</td><td>${safe(ev.where)}</td><td>${safe(ev.note)}</td></tr>`
          )
          .join("")}</tbody></table></div>`
      : "";

    fill(
      "programs",
      `<article class="article">${content.programs.paragraphs.map(paraHTML).join("")}` +
        (content.programs.initiatives
          ? `<ul class="bullet-list">${content.programs.initiatives.map((item) => `<li>${safe(item)}</li>`).join("")}</ul>`
          : "") +
        (eventsHTML ? `<h3>${safe(content.programs.upcomingHeading || "Upcoming events")}</h3>${eventsHTML}` : "") +
        `</article>`
    );
  }

  if (content.faq) {
    fill(
      "faq",
      `<div class="faq">${content.faq.items
        .map(
          (item) =>
            `<details><summary>${safe(item.q)}</summary><p>${safe(item.a)}</p></details>`
        )
        .join("")}</div>`
    );
  }
};
