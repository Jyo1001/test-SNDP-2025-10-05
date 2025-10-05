import { safe } from "./util.js";

export const CONTENT = {
  about: {
    paragraphs: [
      "Sree Narayana Dharma Paripalana (SNDP) Yogam is a reformist movement founded in May 1903 at Aruvippuram to advance Sree Narayana Guru's egalitarian teachings across Kerala.",
      "The Yogam mobilised marginalised communities through temple management, modern education, and cooperative enterprise. Today it administers a wide span of schools, colleges, hospitals, and credit societies anchored in Kollam.",
      "Centenary reports highlight the Yogam's focus on women-led self-help groups, microfinance, and skill-building hubs that combine spiritual practice with tangible social welfare." 
    ],
    highlights: [
      { label: "Founded", value: "May 1903 • Aruvippuram, Kerala" },
      { label: "Headquarters", value: "Kollam, Kerala, India" },
      { label: "Mission", value: "Equality, education, cooperative welfare" },
      { label: "Institutions", value: "Schools, colleges, hospitals & co-ops across Kerala" }
    ]
  },
  guru: {
    paragraphs: [
      "Sree Narayana Guru (1855–1928) was a philosopher, saint, and social reformer whose life work challenged caste exclusion through peaceful, rational reform.",
      "He consecrated a Shiva idol at Aruvippuram in 1888, opened temples to all communities, and founded schools that emphasised literacy, vocational skills, and self-improvement.",
      "Guru's teachings inspired mass movements such as the Vaikom Satyagraha and encouraged communities to \"educate, organise, and industrialise\" alongside spiritual practice." 
    ],
    quote: "One caste, one religion, one God, for humankind"
  },
  history: {
    timeline: [
      { year: "1855", detail: "Birth of Narayana Guru at Chempazhanthy near Thiruvananthapuram." },
      { year: "1888", detail: "Guru consecrates a Shiva idol at Aruvippuram, signalling temple access for all communities." },
      { year: "1903", detail: "SNDP Yogam registers as a charitable society with Guru as patron and Kumaran Asan as founding secretary." },
      { year: "1904", detail: "Launch of the Vivekodayam journal to circulate Guru's writings and cooperative economics." },
      { year: "1924", detail: "SNDP members support the Vaikom Satyagraha, strengthening anti-caste campaigns in Travancore." },
      { year: "1948", detail: "Sree Narayana College, Kollam opens under SNDP Yogam, expanding the movement into higher education." },
      { year: "2003", detail: "Centenary programmes modernise housing, healthcare, and microfinance missions across Kerala." }
    ],
    paragraphs: [
      "Branch unions (shakhas) across Travancore and Cochin coordinated temple reforms, literacy drives, and community banking under the Yogam's banner.",
      "Post-independence, the Yogam diversified into professional colleges, hospitals, cooperative credit societies, and pilgrim services while continuing to advocate for social justice." 
    ]
  },
  chathenkery: {
    paragraphs: [
      "SNDP Chathenkery functions as a ward-level sakha within Chengannur Municipality in Alappuzha district, Kerala. The locality stretches along the Pamba River and links neighbourhoods between Thiruvalla and Chengannur town centres.",
      "Chengannur is widely described as the \"Gateway to Sabarimala\", and Chathenkery volunteers operate pilgrim facilitation desks, first-aid booths, and travel guidance near the Chengannur Mahadevar Temple transit hub.",
      "The unit also works with municipal teams on riverbank clean-ups, flood-relief logistics, scholarship mentoring, and digital literacy labs for students and entrepreneurs." 
    ],
    focus: [
      { label: "Service Area", value: "Chathenkery ward & riverfront clusters in Chengannur Municipality" },
      { label: "Signature Programmes", value: "Pilgrim transit support, Pamba river stewardship, cooperative thrift groups" },
      { label: "Community Facilities", value: "SNDP hall near Chengannur Mahadevar Temple, reading room, skill lab" },
      { label: "Membership", value: "Families, youth, and women's wings coordinating outreach to 150+ households" }
    ]
  },
  programs: {
    paragraphs: [
      "SNDP Yogam runs educational institutions from primary schools to colleges, alongside industrial training centres, hospitals, and cooperative banks across Kerala.",
      "Chathenkery adapts these models locally through women-led self-help collectives, farmland support groups, pilgrim transit operations, and digital literacy labs aligned with municipal priorities." 
    ],
    initiatives: [
      "Pilgrim assistance kiosks during the Sabarimala season at Chengannur transport hubs.",
      "Pamba river clean-up squads with flood preparedness drills and water-quality monitoring.",
      "Scholarship mentoring and digital learning pods for school and college students.",
      "Women's microfinance circles and livelihood training for home-based entrepreneurs.",
      "Health outreach camps and elder-care visits in partnership with SNDP-run hospitals." 
    ],
    upcomingHeading: "Seasonal community programmes"
  },
  faq: {
    items: [
      {
        q: "What is the core aim of SNDP Yogam?",
        a: "To uphold Sree Narayana Guru's ideals of social equality, spiritual progress, and community self-reliance across Kerala." 
      },
      {
        q: "Who can join SNDP Chathenkery?",
        a: "Membership is open to devotees, residents, and well-wishers who subscribe to the Yogam constitution and volunteer with ward-level initiatives." 
      },
      {
        q: "How does the Chathenkery unit serve pilgrims?",
        a: "Volunteers maintain information desks, first-aid, and refreshment support around Chengannur's \"Gateway to Sabarimala\" transit points during peak season." 
      },
      {
        q: "How are local programmes funded?",
        a: "Funding combines member subscriptions, donations, cooperative income, and project grants routed through SNDP Yogam's district offices." 
      },
      {
        q: "What training is offered to youth members?",
        a: "Weekly study circles cover Guru's teachings, digital skills, and disaster-preparedness drills linked to the Pamba river stewardship plan." 
      }
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

  if (content.chathenkery) {
    fill(
      "chathenkery",
      `<article class="article">${content.chathenkery.paragraphs.map(paraHTML).join("")}` +
        (content.chathenkery.focus
          ? `<ul class="fact-list">${content.chathenkery.focus.map(factHTML).join("")}</ul>`
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
