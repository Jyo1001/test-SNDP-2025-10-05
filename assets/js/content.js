import { safe } from "./util.js";

const attr = (value = "") => safe(value).replace(/"/g, "&quot;");
const paraHTML = (text) => `<p>${safe(text)}</p>`;
const paragraphsHTML = (arr = []) => arr.map(paraHTML).join("");
const factHTML = ({ label, value }) => `<li><strong>${safe(label)}:</strong> ${safe(value)}</li>`;
const bulletHTML = (items = [], className = "bullet-list") =>
  items.length ? `<ul class="${className}">${items.map((item) => `<li>${safe(item)}</li>`).join("")}</ul>` : "";
const statTile = ({ label, value }) => `<div class="tile"><div class="big">${safe(value)}</div><div class="sub">${safe(label)}</div></div>`;
const calloutHTML = (callout) =>
  callout ? `<div class="callout"><strong>${safe(callout.title)}</strong> ${safe(callout.body)}</div>` : "";
const qaHTML = ({ q, a }) => `<details><summary>${safe(q)}</summary><p>${safe(a)}</p></details>`;
const galleryCard = ({ title, description, link, linkLabel }) => `
  <figure>
    <div class="gallery-card">
      <h3>${safe(title)}</h3>
      <p>${safe(description)}</p>
      ${link ? `<a href="${attr(link)}" target="_blank" rel="noopener">${safe(linkLabel || "Learn more")}</a>` : ""}
    </div>
  </figure>`;
const referenceItem = ({ label, url, note }) =>
  `<li><a href="${attr(url)}" target="_blank" rel="noopener">${safe(label)}</a>${note ? `<small>${safe(note)}</small>` : ""}</li>`;

export const CONTENT = {
  home: {
    intro: [
      "Sree Narayana Dharma Paripalana (SNDP) Yogam is a socio-religious organisation founded on 15 May 1903 at Aruvippuram in the former princely state of Travancore to promote Sree Narayana Guru's egalitarian teachings.",
      "The Yogam mobilised Kerala's Ezhava community around campaigns for education, temple entry reform, and cooperative self-help while keeping its headquarters in Kollam, a port city long associated with the Guru's disciples.",
      "Affiliated Sree Narayana Trusts continue to operate schools, colleges, hospitals, and industrial ventures across Kerala, extending the Guru's call for social equality and self-improvement to new generations."
    ],
    stats: [
      { label: "Date of formation", value: "15 May 1903" },
      { label: "Founding site", value: "Aruvippuram, Travancore" },
      { label: "Head office", value: "Kollam, Kerala, India" },
      { label: "Guiding motto", value: "One caste, one religion, one God" }
    ],
    highlights: [
      "Registered as a charitable society that aligned Guru's devotees behind organised social reform.",
      "Local branch unions (shakhas) coordinate temple management, literacy drives, relief work, and member services across Kerala.",
      "Sree Narayana Trusts and allied bodies run higher education campuses, hospitals, hostels, and cooperative enterprises."
    ],
    quote: "Strengthen yourselves through organisation, education, and industry — the path Sree Narayana Guru set for his followers.",
    callout: {
      title: "Founders' Day",
      body: "Every 15 May is marked with meetings and cultural programmes that retell the Aruvippuram founding story."
    }
  },
  about: {
    paragraphs: [
      "SNDP Yogam emerged at the turn of the twentieth century as the organisational vehicle for Sree Narayana Guru's reform movement among Kerala's Ezhava community, combining spiritual guidance with campaigns for dignity and representation.",
      "Guru accepted the role of lifetime spiritual guide while physician-activist Dr. Padmanabhan Palpu and poet Kumaran Asan crafted the Yogam's constitution, emphasising education, modern management of temples, and self-help cooperatives.",
      "From its Kollam headquarters, the Yogam coordinates hundreds of branch unions that maintain temples, operate schools and hostels, and represent member interests before government bodies."
    ],
    highlights: [
      { label: "Founders", value: "Sree Narayana Guru, Dr. Padmanabhan Palpu, Kumaran Asan" },
      { label: "Registered", value: "15 May 1903 as a charitable society" },
      { label: "Membership base", value: "Kerala's Ezhava community and allied progressives" },
      { label: "Headquarters", value: "SNDP Yogam building, Kollam" }
    ],
    keyInstitutions: [
      "Sree Narayana Trusts manage arts and science colleges across Kollam, Alappuzha, Ernakulam, and Kozhikode.",
      "SNDP Yogam schools and hostels provide first-generation learners with access to modern education.",
      "Member-run cooperatives in coir, handloom, dairy, and microfinance create employment and community capital."
    ]
  },
  guru: {
    paragraphs: [
      "Sree Narayana Guru (1855–1928) was born at Chempazhanthy near Thiruvananthapuram and became one of Kerala's most influential philosophers and social reformers.",
      "In 1888 he consecrated a Shiva idol at Aruvippuram, defying caste restrictions on temple rites and signalling that spiritual practice should be open to all seekers.",
      "Guru authored works such as the \"Atmopadesa Śatakam\" (Hundred Verses of Self-Instruction) and \"Jati Nirnayam\" (An Inquiry into Caste), combining Advaita Vedanta insights with a practical ethic of equality and self-improvement."
    ],
    quote: "One caste, one religion, one God, for humankind.",
    works: [
      "Atmopadesa Śatakam — one hundred verses guiding self-realisation.",
      "Jati Nirnayam — a critique of caste divisions and hereditary privilege.",
      "Daiva Dasakam — a ten-verse devotional hymn that remains popular in Kerala homes.",
      "Adarsa Mala — verses outlining moral discipline for daily life."
    ]
  },
  history: {
    timeline: [
      { year: "1855", detail: "Birth of Narayana Guru at Chempazhanthy in Travancore." },
      { year: "1888", detail: "Guru consecrates a Shiva idol at Aruvippuram, asserting temple entry rights for all communities." },
      { year: "1903", detail: "SNDP Yogam is registered to organise devotees and promote education and social reform." },
      { year: "1904", detail: "Poet Kumaran Asan becomes the first general secretary, articulating the Yogam's programmes and publications." },
      { year: "1913", detail: "Guru establishes the Advaita Ashram at Aluva as a centre for study and interfaith dialogue." },
      { year: "1924", detail: "The All-Religion Conference at Aluva, convened by the Guru, gathers reformers from across India." },
      { year: "1928", detail: "Passing of Sree Narayana Guru; the Yogam expands colleges, hostels, and cooperatives in his memory." }
    ],
    paragraphs: [
      "Early SNDP meetings focused on temple entry, literacy, and the removal of social disabilities imposed on the Ezhava community by Travancore's caste hierarchy.",
      "After Indian independence the Yogam diversified into trust-run colleges, teacher training institutes, hospitals, and cooperative banks, maintaining the Guru's emphasis on organised self-help.",
      "Today the Yogam collaborates with Sivagiri pilgrimage committees, youth movements, and government welfare boards while advocating for social justice and inclusive development in Kerala."
    ]
  },
  unit9: {
    paragraphs: [
      "Unit 9 follows the Yogam's standard shakha (branch) model, grouping families around a local temple committee to coordinate worship, cultural study circles, and community service.",
      "Volunteers liaise with the Kollam headquarters to host commemorations of the Guru, register new members, and administer scholarships or relief grants for neighbourhood households."
    ],
    focus: [
      { label: "Membership", value: "Open to devotees, well-wishers, and families aligned with the Guru's ideals." },
      { label: "Meeting cadence", value: "Monthly satsang, quarterly general body, annual Guru Jayanthi celebration." },
      { label: "Service area", value: "Wards and neighbourhoods across central Kollam." }
    ],
    initiatives: [
      "Organise Guru Jayanthi and Sivagiri pilgrimage send-offs with cultural performances and study sessions.",
      "Coordinate tuition support and book banks for students preparing for school and university examinations.",
      "Maintain thrift and credit circles that provide micro-loans for self-employment and emergency relief.",
      "Run health camps in partnership with SNDP Yogam Medical Mission units and local hospitals."
    ]
  },
  programs: {
    paragraphs: [
      "SNDP Yogam's flagship programmes invest in education, with Sree Narayana Trust colleges and schools providing affordable arts, science, and vocational courses across Kerala.",
      "The Yogam organises welfare schemes for women, youth, and the elderly through neighbourhood shakhas, offering counselling, financial literacy workshops, and cultural events.",
      "Cooperative societies promoted by the Yogam strengthen local industries such as coir, handloom, dairy, and tourism, giving members access to credit and markets."
    ],
    initiatives: [
      "Establish and manage Sree Narayana arts and science colleges, teacher training institutes, and polytechnics.",
      "Operate SNDP Yogam schools, hostels, and boarding homes for first-generation learners.",
      "Support Sivagiri pilgrimage logistics, youth clubs, and interfaith dialogue forums inspired by the Guru.",
      "Run member-owned cooperatives in coir, dairy, and small-scale manufacturing with training for entrepreneurs."
    ],
    services: [
      "Scholarships and fee concessions for meritorious students from disadvantaged backgrounds.",
      "Microfinance groups and credit unions that extend small loans at cooperative rates.",
      "Health outreach through medical camps, preventive screenings, and wellness seminars.",
      "Disaster relief drives coordinated with local government and voluntary organisations."
    ],
    upcomingHeading: "Upcoming community programmes"
  },
  directory: {
    intro: [
      "SNDP Yogam organises membership through registered shakhas; each unit maintains a directory of families, office-bearers, and volunteers for coordination.",
      "Use the filters below to look up fellow members, confirm contact details before events, and link community needs with available support."],
    notes: [
      "Member records typically include service roles such as temple trustee, youth coordinator, or cooperative convener.",
      "Contact information is shared for organisational purposes — please respect privacy and data protection norms." ]
  },
  notices: {
    intro: [
      "Branch notices capture the pulse of Yogam life, from Guru Jayanthi celebrations and Sivagiri pilgrimage plans to cooperative meetings and welfare drives.",
      "Events often combine devotional gatherings with lectures on education, temperance, and self-reliant livelihoods championed by the Guru."],
    tips: [
      "Keep event descriptions concise and include venue landmarks familiar to members.",
      "Highlight volunteer requirements so visitors know how they can contribute."
    ]
  },
  gallery: {
    intro: [
      "Explore landmark sites connected with Sree Narayana Guru and SNDP Yogam's organisational history.",
      "Each card links to public reference material that elaborates on the event or institution."],
    items: [
      {
        title: "Aruvippuram Shiva Temple",
        description: "Site of the 1888 consecration where the Guru installed a Shiva idol, asserting temple access for all communities and inspiring the Yogam's formation.",
        link: "https://en.wikipedia.org/wiki/Aruvippuram",
        linkLabel: "Read about Aruvippuram"
      },
      {
        title: "Sivagiri Mutt, Varkala",
        description: "Monastic centre established under the Guru's guidance that now hosts the Sivagiri pilgrimage, a major platform for SNDP-linked reform dialogues.",
        link: "https://en.wikipedia.org/wiki/Sivagiri,_Kerala",
        linkLabel: "Discover Sivagiri"
      },
      {
        title: "SNDP Yogam Headquarters, Kollam",
        description: "Administrative hub in Kollam that coordinates branch unions, educational trusts, and cooperative ventures across Kerala.",
        link: "https://en.wikipedia.org/wiki/Kollam",
        linkLabel: "Visit Kollam's history"
      }
    ]
  },
  faq: {
    items: [
      {
        q: "What is the core aim of SNDP Yogam?",
        a: "The Yogam works to uphold Sree Narayana Guru's ideals of social equality, spiritual progress, and organised self-help among Kerala's marginalised communities."
      },
      {
        q: "Who can join a local unit?",
        a: "Membership is generally open to devotees and supporters who agree to the Yogam's constitution, participate in branch meetings, and contribute to community service."
      },
      {
        q: "How are institutions managed?",
        a: "Educational and medical institutions are administered through Sree Narayana Trusts and SNDP Yogam committees with governing councils elected from among members."
      },
      {
        q: "What is the significance of the Guru's motto?",
        a: "The motto 'One caste, one religion, one God, for humankind' summarises Narayana Guru's call for equality, fraternity, and universal spiritual access."
      },
      {
        q: "How can supporters contribute?",
        a: "Volunteer for shakha events, mentor students, donate to scholarship funds, or help expand cooperative enterprises rooted in fair trade and social welfare."
      }
    ]
  },
  loans: {
    intro: [
      "SNDP Yogam's thrift and credit societies mirror Kerala's long tradition of cooperative finance, enabling members to access small loans without predatory interest rates.",
      "Loan proceeds typically support self-employment, education fees, home repairs, or medical care — reflecting the Yogam's focus on practical uplift."
    ],
    guidance: [
      "Branch accountants maintain ledgers, issue receipts, and review balances at monthly meetings.",
      "Members are encouraged to make digital payments when possible and to keep personal contact information current for audit compliance." ],
    footnote: "Demo credentials are provided for exploration; replace them with production authentication when deploying."
  },
  references: {
    intro: [
      "The following public sources provide detailed historical, biographical, and institutional information referenced throughout this demo site." ],
    sources: [
      {
        label: "Sree Narayana Dharma Paripalana Yogam — Wikipedia",
        url: "https://en.wikipedia.org/wiki/Sree_Narayana_Dharma_Paripalana_Yogam",
        note: "Overview of the organisation's founding, leadership, and programmes."
      },
      {
        label: "Narayana Guru — Wikipedia",
        url: "https://en.wikipedia.org/wiki/Narayana_Guru",
        note: "Biography of the Guru with key reform milestones and writings."
      },
      {
        label: "Narayana Guru | Britannica",
        url: "https://www.britannica.com/biography/Narayana-Guru",
        note: "Concise profile highlighting the Guru's philosophy and influence."
      }
    ]
  }
};

export const renderStaticContent = (content, events = []) => {
  const fill = (id, html) => {
    const el = document.getElementById(id);
    if (el && html) el.innerHTML = html;
  };

  if (content.home) {
    const statsBox = document.getElementById("homeStats");
    if (statsBox && content.home.stats) {
      statsBox.classList.add("stat-grid");
      statsBox.innerHTML = content.home.stats.map(statTile).join("");
    }
    fill(
      "homeOverview",
      `<article class="article home-article">${paragraphsHTML(content.home.intro)}` +
        (content.home.highlights ? bulletHTML(content.home.highlights, "highlight-list") : "") +
        (content.home.quote ? `<blockquote class="quote">${safe(content.home.quote)}</blockquote>` : "") +
        calloutHTML(content.home.callout) +
        `</article>`
    );
  }

  if (content.about) {
    fill(
      "about",
      `<article class="article">${paragraphsHTML(content.about.paragraphs)}` +
        (content.about.highlights ? `<ul class="fact-list">${content.about.highlights.map(factHTML).join("")}</ul>` : "") +
        (content.about.keyInstitutions
          ? `<div><h3>Key institutions</h3>${bulletHTML(content.about.keyInstitutions)}</div>`
          : "") +
        `</article>`
    );
  }

  if (content.guru) {
    fill(
      "guru",
      `<article class="article">${paragraphsHTML(content.guru.paragraphs)}` +
        (content.guru.quote ? `<blockquote class="quote">${safe(content.guru.quote)}</blockquote>` : "") +
        (content.guru.works ? `<div><h3>Selected works</h3>${bulletHTML(content.guru.works)}</div>` : "") +
        `</article>`
    );
  }

  if (content.history) {
    fill(
      "history",
      `<article class="article">` +
        (content.history.timeline
          ? `<ul class="timeline">${content.history.timeline
              .map((item) => `<li><span class="year">${safe(item.year)}</span><span>${safe(item.detail)}</span></li>`)
              .join("")}</ul>`
          : "") +
        paragraphsHTML(content.history.paragraphs) +
        `</article>`
    );
  }

  if (content.unit9) {
    fill(
      "unit9",
      `<article class="article">${paragraphsHTML(content.unit9.paragraphs)}` +
        (content.unit9.focus ? `<ul class="fact-list">${content.unit9.focus.map(factHTML).join("")}</ul>` : "") +
        (content.unit9.initiatives
          ? `<div><h3>Local initiatives</h3>${bulletHTML(content.unit9.initiatives)}</div>`
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
      `<article class="article">${paragraphsHTML(content.programs.paragraphs)}` +
        (content.programs.initiatives
          ? `<div><h3>Flagship initiatives</h3>${bulletHTML(content.programs.initiatives)}</div>`
          : "") +
        (content.programs.services
          ? `<div><h3>Member services</h3>${bulletHTML(content.programs.services)}</div>`
          : "") +
        (eventsHTML ? `<h3>${safe(content.programs.upcomingHeading || "Upcoming events")}</h3>${eventsHTML}` : "") +
        `</article>`
    );
  }

  if (content.directory) {
    fill(
      "directoryIntro",
      `<article class="article">${paragraphsHTML(content.directory.intro)}` +
        (content.directory.notes ? bulletHTML(content.directory.notes, "highlight-list") : "") +
        `</article>`
    );
  }

  if (content.notices) {
    fill(
      "noticesIntro",
      `<article class="article">${paragraphsHTML(content.notices.intro)}` +
        (content.notices.tips ? `<h3>Noticeboard tips</h3>${bulletHTML(content.notices.tips)}` : "") +
        `</article>`
    );
  }

  if (content.gallery) {
    fill(
      "galleryIntro",
      `<article class="article">${paragraphsHTML(content.gallery.intro)}</article>`
    );
    const grid = document.getElementById("galleryGrid");
    if (grid && content.gallery.items) {
      grid.innerHTML = content.gallery.items.map(galleryCard).join("");
    }
  }

  if (content.faq) {
    fill(
      "faq",
      `<div class="faq">${content.faq.items.map(qaHTML).join("")}</div>`
    );
  }

  if (content.loans) {
    fill(
      "loansIntro",
      `<article class="article">${paragraphsHTML(content.loans.intro)}` +
        (content.loans.guidance ? `<h3>How to use this portal</h3>${bulletHTML(content.loans.guidance)}` : "") +
        (content.loans.footnote ? `<p><em>${safe(content.loans.footnote)}</em></p>` : "") +
        `</article>`
    );
  }

  if (content.references) {
    fill(
      "referencesIntro",
      `<article class="article">${paragraphsHTML(content.references.intro)}</article>`
    );
    const list = document.getElementById("referencesList");
    if (list && content.references.sources) {
      list.classList.add("references-list");
      list.innerHTML = content.references.sources.map(referenceItem).join("");
    }
  }
};
