/* Written text of the platform. Every statement comes from INVESTIGACION.md, which cites the PSI record,
   table or report page behind it. Summaries were written with AI from those records and are marked as such
   in the interface. "why" fields and anything labelled interpretation are the team's reading, not NASA's. */
window.OFMW_CONTENT = {
  investigations: {
    "PSI-20": {
      line: "Gas flames on a porous burner that emulate how a solid or liquid material burns, run in the three atmospheres NASA considers for crewed missions.",
      finding: "Flames mostly self-extinguished at 21 % oxygen and 14.7 psia. At 27 % and 10.2 psia, and at 34 % and 8.2 psia, they generally persisted for two to three minutes or more (2022 final report, pp. 18 and 55). The per-test data agree: near 8.2 psia with 29.8 to 39.3 % oxygen, 25 of 36 flames kept burning until the fuel was cut off.",
      why: "The most direct bridge between gas flames and material flammability in exploration atmospheres. 34 of its 177 tests are near Moon-base conditions.",
      caveat: "Per-test pressure and outcome come from a thesis archived with the reports, read from the PDF text and not yet checked by eye."
    },
    "PSI-25": {
      line: "Solid samples (acrylic, cotton-fiberglass fabric, Nomex, wax) burned in a small flow duct, with oxygen lowered below 21 % by adding nitrogen.",
      finding: "The flammability boundary is U-shaped against airflow. Cotton-fiberglass fabric goes out when the flow drops to between 1 and 5 cm/s. Thin PMMA at 1 atm extinguishes near 10 mm/s at 21 % oxygen and near 30 mm/s at 16 % (summary report NASA/TM-20210011385, pp. 19, 36 and 109).",
      why: "The best solids database in PSI, and the one that shows the gap above 22 % oxygen: 129 tests, all between 13.6 and 22.2 %.",
      caveat: "Most results are free-text observations. Spread rate is given for 20 tests and outcome for another 20."
    },
    "PSI-26": {
      line: "Solid samples burned in the Microgravity Science Glovebox with controlled airflow. The only investigation that applied a suppressant, nitrogen, to burning solids.",
      finding: "Its as-run test matrix gives, test by test, oxygen (16.1 to 22.7 %), pressure (14.3 to 14.8 psi), flow (0 to 44 cm/s) and observations. Nitrogen was applied in 7 tests.",
      why: "Highly relevant by objective: it questions the ground flammability test NASA-STD-6001 Test 1. It holds the highest oxygen recorded for a solid in PSI, 22.7 %.",
      caveat: "The effect of nitrogen is described in text, not measured. Its final report is listed in PSI but returns an error."
    },
    "PSI-69": {
      line: "Single droplets of methanol and heptane burned in atmospheres diluted with carbon dioxide or helium, to measure how suppressants put a flame out.",
      finding: "274 tests with oxygen, pressure, suppressant and outcome: 186 ended in extinction, 61 in droplet disruption and 27 burned to completion. 103 ran at a nominal 0.7 atm, and 17 of those with 30 to 34 % oxygen.",
      why: "The only investigation with suppressants, and the only one with individual tests of a condensed fuel near the Moon-base atmosphere. Its design document says it quantifies the effect of candidate exploration atmospheres on suppression.",
      caveat: "Only two liquid fuels. The 0.7 atm tests measured 10.3 to 10.5 psi, just above the 10.2 psi the challenge gives for a Moon base."
    },
    "PSI-98": {
      line: "A cotton-fiberglass sheet of 40.6 by 94 cm burned inside a Cygnus cargo vehicle.",
      finding: "2 samples at 20 cm/s airflow and 21.5 to 21.7 % oxygen.",
      why: "Few data points, but at real scale: by the team's reading, the largest fire set on purpose in space.",
      caveat: "The table gives burn time only."
    },
    "PSI-99": {
      line: "Nine samples of silicone, cotton-fiberglass, PMMA and Nomex burned in a Cygnus vehicle, each compared with the same test in normal gravity.",
      finding: "Thin silicone did not spread flame in microgravity (burn length about 0), yet in normal gravity two of the four silicone samples burned completely. Cotton-fiberglass burned its full 29 cm in both.",
      why: "The best direct comparison of microgravity against normal gravity, material by material.",
      caveat: "Nine samples, at 20 cm/s in the PSI table and Earth-like oxygen (21.5 to 22.1 %). The 2017 Saffire slides by Urban and others give 25 cm/s for sample 2-6 and about 22.1 % oxygen for sample 2-1, where PSI says 21.5 %."
    },
    "PSI-100": {
      line: "A large cotton-fiberglass sample burned in a Cygnus vehicle at a higher airflow than Saffire-I.",
      finding: "2 samples at 30 cm/s. The table has no oxygen or result; the vehicle sensors give 19.4 to 20.1 % oxygen and 14.4 to 14.5 psi. Outside PSI, the 2017 Saffire slides by Urban and others disagree on two points: 25 cm/s instead of 30, and oxygen falling from 21.2 to 21.0 % instead of the 19.7 and 19.9 % on the PSI records. They also give the results the table lacks: 300 s of concurrent burning at 2.3 mm/s and 60 s of opposed burning at 0.98 mm/s (slides 30 and 31).",
      why: "Relevant for its scale.",
      caveat: "Almost no data in the experimental table."
    },
    "PSI-101": {
      line: "Smoke from overheated spacecraft materials (Kapton, silicone, Teflon, lamp wick, Pyrell) measured in microgravity, including how it ages.",
      finding: "Fresh smoke has a geometric mean diameter from 42 nm (Kapton) to 149 nm (Pyrell); after 720 s of aging, from 70 to 293 nm. The final report (p. 5) concludes that Kapton and Teflon smoke will be hard to detect with light-scattering devices, and that telling smoke from dust without false alarms needs a detector that measures more than one moment of the size distribution.",
      why: "The basis for designing smoke detectors for microgravity.",
      caveat: "No oxygen or pressure recorded. The 109 rows are 67 runs plus their secondary agings."
    },
    "PSI-102": {
      line: "Smoke particle size and detector response measured in microgravity in 2007 for Teflon, Kapton, silicone, lamp wick and a liquid reference.",
      finding: "The final report puts the count mean diameters of the smoke particles in the 100 to 200 nm range and gives 227 nm for silicone (p. 56); in the per-run results, single silicone runs reach 372 nm. The Shuttle ionization detector gave a strong signal in every test; the Station light-scattering detector was erratic with Teflon smoke, whose particles are smaller than one micrometer (pp. 25 and 28).",
      why: "Same relevance as SAME-R, with fewer runs.",
      caveat: "The experimental table has 8 rows; the 45 runs come from its results file."
    },
    "PSI-159": {
      line: "Spherical gas flames of ethane, propane and butane, including inverse flames where the oxidizer flows out of the burner.",
      finding: "333 tests with oxygen, pressure and outcome. 20 normal flames ran with 33 to 39 % oxygen in the chamber at 7.3 psi. In the inverse flames the burner oxidizer reaches 85 % oxygen.",
      why: "20 tests near Moon-base conditions, with gas rather than materials.",
      caveat: "The 85 % figure is the gas leaving the burner, not the chamber atmosphere, so it is not counted as ambient oxygen."
    },
    "PSI-10": {
      line: "Spherical flames used to find the limits of soot formation and of extinction.",
      finding: "327 tests with oxygen and pressure together; chamber atmosphere from 19.8 to 40 % oxygen.",
      why: "It does not study materials, but its extinction limits are useful for models.",
      caveat: ""
    },
    "PSI-22": {
      line: "Flames under an electric field. The challenge names it as the experiment that mimicked partial gravity.",
      finding: "Its final report (p. 37) suggests that electric fields could approximate the buoyancy forces of partial gravity.",
      why: "Relevant only as an approach to the partial-gravity gap.",
      caveat: "A suggestion, not a measurement. The table has no voltages or oxygen, and its record says it was not designed for space applications."
    },
    "PSI-23": {
      line: "Structure and extinction of spherical flames.",
      finding: "Test days at 21 and 30 % oxygen near 1 atm, diluted with nitrogen or helium.",
      why: "Adds extinction with helium at 30 % oxygen.",
      caveat: "Data by test day, not by individual test."
    },
    "PSI-39": {
      line: "Cool flames in burning fuel droplets.",
      finding: "Above about 2 atm, reignition cycles appear: the hot flame goes out by radiative loss, a cool flame remains, and it reignites until the droplet is consumed (final report, pp. 6 and 9). Its data summary has 227 tests with extinction diameters, burning rates and reignitions.",
      why: "Cool flames matter for safety because a droplet can keep reacting after the visible flame is gone. NASA's 2015 researcher's guide says this about FLEX.",
      caveat: "Oxygen only at 17 and 21 %."
    },
    "PSI-47": {
      line: "Two 2005 sessions that tested a particle counter in microgravity with test dust. Nothing was burned.",
      finding: "Very little data: two sessions.",
      why: "Relevant to telling smoke from dust in a detector. It used an instrument later flown in SAME.",
      caveat: ""
    },
    "PSI-68": {
      line: "Droplet combustion of eight fuels and mixtures.",
      finding: "The table is a matrix by fuel with ranges, not individual tests. Its 124 measured chamber fills go from 16.6 to 39.7 % oxygen between 7.4 and 45.2 psia; none has 30 % or more at 11 psia or less.",
      why: "It does not cover Moon-base conditions. It does add high oxygen with helium at 1 and 3 atm.",
      caveat: "Which fill was used in which test is not known."
    },
    "PSI-107": {
      line: "Smoke points of gas jet flames in coflowing air.",
      finding: "435 distinct tests with nozzle, fuel flow and air velocity (0.3 to 85 cm/s). The final report gives 52 smoke points for ethylene, propane, propylene and propylene-nitrogen mixtures.",
      why: "The smoke point tells how much soot a fuel makes, which matters for detection and for flame radiation.",
      caveat: "No oxygen recorded."
    },
    "PSI-21": {
      line: "Dilute coflow flames near extinction, for model validation.",
      finding: "Test days only; the table has no oxygen, pressure or flow.",
      why: "Useful to validate models of flames near extinction.",
      caveat: ""
    },
    "PSI-106": {
      line: "Structure and lift-off of laminar flames.",
      finding: "12 test days with the fuel of the day; no oxygen or flow.",
      why: "Flame science for model validation.",
      caveat: ""
    },
    "PSI-62": {
      line: "Ground study that models concurrent flame spread over solids using BASS data.",
      finding: "No experimental table.",
      why: "An example of what the challenge asks for: flight data feeding a predictive model.",
      caveat: ""
    },
    "PSI-115": {
      line: "Ground study that simulates how smoke grows with gravity, using SAME data.",
      finding: "No experimental table.",
      why: "Connects the microgravity smoke measurements with normal gravity.",
      caveat: ""
    },
    "PSI-117": {
      line: "Ground study of cool flames in droplets, using FLEX data.",
      finding: "No experimental table.",
      why: "Basic science built on flight data.",
      caveat: ""
    },
    "PSI-142": {
      line: "Ground study of flammability limits, using FLEX data.",
      finding: "Its table is an index of figures from papers, not a list of tests.",
      why: "Basic science built on flight data.",
      caveat: ""
    },
    "PSI-60": {
      line: "Ground study that reanalyzes soot in the SPICE flames.",
      finding: "No experimental table.",
      why: "Basic science built on flight data.",
      caveat: ""
    },
    "PSI-179": {
      line: "Sampling of the particles in the Station cabin air. Nothing is burned.",
      finding: "No experimental table.",
      why: "It describes the background dust a smoke detector has to tell apart from smoke.",
      caveat: "Not a combustion investigation; kept as context for detection."
    }
  },

  worlds: {
    station: {
      headline: "Where almost everything was tested",
      prevention: "In PSI, solids were burned only here. 263 solid-fuel rows carry measured oxygen, from 13.6 to 22.7 %: the PSI experiments lowered the oxygen, never raised it. BASS and BASS-II found a U-shaped flammability boundary against airflow.",
      detection: "154 smoke runs in SAME and SAME-R, 131 with particle size. The Station detector measures scattered light and responds best to particles larger than one micrometer; Kapton and Teflon smoke is finer and will be hard to detect (SAME-R final report, p. 5).",
      suppression: "FLEX burned 274 droplets with carbon dioxide or helium and recorded how each ended. BASS applied nitrogen to burning solids in 7 tests.",
      takeaway: "This is the baseline. Every other world is read against it."
    },
    moon: {
      headline: "Flames here do not go out on their own",
      prevention: "71 tests ran in air like this, none with solids: 34 gas flames from ACME BRE, 20 from ACME CFI-G and 17 droplets from FLEX. In BRE, near 8.2 psia with 29.8 to 39.3 % oxygen, 25 of 36 flames kept burning until the fuel was cut off. Near 14.7 psia with less than 23 % oxygen, all 10 went out by themselves. Outside PSI, NASA's Saffire VI burned SIBAL and PMMA in microgravity at 28.8 to 31.0 % oxygen and about 55 kPa (8 psi), almost Moon-base air (34 % and 8.2 psi); its results are preliminary and its test-by-test data are not open in PSI.",
      detection: "No smoke test in PSI was run in this atmosphere. The smoke experiments do not record oxygen or pressure. Outside PSI, in Saffire VI (preliminary), the smoke was readily detected at 981 s, after most of the hazardous gas had been released, and in the PMMA tests cabin carbon monoxide passed its 24-hour limit.",
      suppression: "The 17 FLEX droplets, at 0.7 atm with 30 to 34 % oxygen, are the only tests from a suppression experiment near these conditions.",
      takeaway: "No fabric or plastic has been burned in microgravity with Moon-base air in the data PSI holds. Outside PSI, NASA's Saffire VI burned cotton-fiberglass fabric and acrylic at 28.8 to 31.0 % oxygen and about 55 kPa (8 psi) in a cargo ship in December 2023, almost Moon-base air; its results are preliminary and its test-by-test data are not open in PSI. Lunar gravity itself has only been reproduced for seconds at a time, in parabolic flights and in centrifuges inside drop towers; no long test is known in PSI or in the sources on this site."
    },
    suit: {
      headline: "No test in PSI",
      prevention: "No test in PSI comes close to 100 % oxygen at 4.3 psi. The highest ambient oxygen in PSI is 40 % and the lowest pressure is 6.2 psi. NASA-STD-6001B asks that each material be tested in the highest oxygen it could see in use (p. 29); the standard does not name suits, and no suit-material result is on this site.",
      detection: "No data in PSI.",
      suppression: "No data in PSI.",
      takeaway: "Apollo 1 burned in a cabin filled with 100 % oxygen. PSI holds no combustion test in a pure-oxygen atmosphere."
    },
    mars: {
      headline: "No data in PSI yet",
      prevention: "PSI holds no partial-gravity combustion data, and the challenge gives no atmosphere for a Mars habitat. It does say that microgravity and normal-gravity results could bound what happens in between. Outside PSI, parabolic flights on NASA's KC-135 measured flame spread over thin solids from 0.1 to 1 g, a range that includes Mars gravity (0.38 g), for seconds at a time (NTRS 20040053567).",
      detection: "No data in PSI.",
      suppression: "No data in PSI.",
      takeaway: "ACME E-FIELD Flames suggests that electric fields could approximate partial-gravity buoyancy. It is a suggestion in a report, not a measurement."
    },
    earth: {
      headline: "The other end of the scale",
      prevention: "Saffire-II burned 9 samples in orbit and compared each with normal gravity. Thin silicone did not spread flame in microgravity, yet two of four silicone samples burned completely in normal gravity. NASA's 2015 guide adds the reverse warning: materials can burn at lower oxygen in microgravity than on Earth, so the ground test is not conservative.",
      detection: "A detector first built for the Space Shuttle tells combustion particles from dust, and is used in mines (NASA Spinoff, 1978). SAME shows why that matters: particle size decides whether a detector sees the smoke.",
      suppression: "The challenge cites fine-water-mist extinguishers developed for the Station as a benefit on Earth. PSI holds no water-mist test.",
      takeaway: "PSI records an Earth-benefits statement for every investigation, and five ground studies reuse flight data to build models. Firefighter air tanks (1976) and protective clothing (1982) came from NASA work."
    }
  },

  /* What to burn next. The order is the team's proposal, not NASA's. */
  agenda: [
    { id: "solids-moon", title: "Burn solids in Moon-base air", worlds: ["moon"], front: "prevention",
      why: "No solid with data in PSI was tested above 22.7 % oxygen. A Moon base is expected at 30 % or more and 10.2 psi or less, where gas flames already tend to keep burning. Outside PSI, Saffire VI (December 2023, preliminary results) burned SIBAL and PMMA in microgravity at 28.8 to 31.0 % oxygen near 55 kPa, almost Moon-base air. What is still missing: those data open test by test, any test in lunar gravity, and the materials that fly today, such as wires, foams, batteries and suit fabrics.",
      closest: "ACME BRE emulates a burning material with gas in exactly these atmospheres.", planned: "" },
    { id: "partial-gravity", title: "Test flames in lunar and Martian gravity", worlds: ["moon", "mars"], front: "prevention",
      why: "PSI has no partial-gravity combustion data. Everything is either microgravity or normal gravity.",
      closest: "Saffire-II compares microgravity with normal gravity for 9 samples.", planned: "The challenge names two future experiments: LUCI and FM2." },
    { id: "smoke-atmospheres", title: "Measure smoke in exploration atmospheres", worlds: ["moon", "suit", "mars"], front: "detection",
      why: "In PSI, no smoke experiment records oxygen or pressure. Outside PSI, Saffire VI (preliminary results, ICES 2024) detected smoke in near Moon-base air, but no particle sizes from it are open.",
      closest: "SAME and SAME-R give particle size for five materials in Station air.", planned: "" },
    { id: "suppress-solids", title: "Measure suppression on burning solids", worlds: ["station", "moon", "earth"], front: "suppression",
      why: "Suppressant data is for droplets of two liquids. On solids there are 7 nitrogen tests whose effect is described, not measured. PSI holds no water-mist test.",
      closest: "FLEX measures extinction with carbon dioxide and helium.", planned: "" },
    { id: "suit", title: "Test pure-oxygen, low-pressure conditions", worlds: ["suit"], front: "prevention",
      why: "A spacesuit holds 100 % oxygen at 4.3 psi. The closest ambient test in PSI is 40 % oxygen.",
      closest: "ACME CFI-G reaches 85 % oxygen, but only in the gas leaving the burner.", planned: "" },
    { id: "materials", title: "Test the materials flown today", worlds: ["station", "moon", "mars"], front: "prevention",
      why: "PSI covers acrylic, cotton-fiberglass, Nomex, wax and a few more. There are no wires, foams, batteries or suit fabrics.",
      closest: "BASS, BASS-II and Saffire test the solid materials PSI holds.", planned: "" }
  ],

  /* From accident to experiment. Which investigation answers which event is the team's reading. */
  timeline: [
    { year: "1967", title: "Apollo 1", kind: "accident",
      what: "Fire in the cabin during a pre-launch test. The cabin was filled with 100 % oxygen; the crew died.",
      lesson: "NASA limited and controlled combustible materials, replaced the hatch and redesigned the suits with fire-resistant materials.",
      answers: ["PSI-20", "PSI-26", "PSI-25"], front: "prevention",
      source: "NASA Safety and Mission Assurance, Apollo 1 page (no date shown)", url: "https://sma.nasa.gov/sma-disciplines/accllp/apollo-1" },
    { year: "1970", title: "Apollo 13", kind: "accident",
      what: "An oxygen tank exploded on the way to the Moon. Before launch, its heaters were run for hours on a 65 V ground supply; their thermostatic switches, rated for 28 V, did not open, and the heaters may have reached about 1,000 °F, enough to severely damage the Teflon insulation of the wiring inside the tank. In flight, turning on the tank fans made a spark that ignited the oxygen.",
      lesson: "The case study traces the explosion to a chain of small events on the ground: a dropped tank shelf, a tank that would not empty, and heaters left on at the wrong voltage. Most of the people deciding on launch did not know about the heater use.",
      answers: [], front: "prevention",
      source: "Anderson, A Case Study of the Failure on Apollo 13, NASA Marshall Space Flight Center, 2011, based on the Apollo 13 Review Board report (NTRS 20110015690)", url: "https://ntrs.nasa.gov/citations/20110015690" },
    { year: "1974", title: "Skylab burns materials in orbit", kind: "experiment",
      what: "Aluminized Mylar, nylon, polyurethane foam, paper, Teflon fabric and other materials were burned in a small sphere aboard Skylab 4. Up to 1989 these were the only solid-material combustion experiments in orbit.",
      lesson: "Venting the chamber to vacuum made the flame flare for a moment before it went out, and a poorly dispersed water spray scattered burning material instead of putting it out.",
      answers: [], front: "suppression",
      source: "Friedman and Olson, Fire Safety Applications for Spacecraft, NASA TM-101463 (1989), p. 7", url: "https://ntrs.nasa.gov/citations/19890015042" },
    { year: "1989", title: "A warning about gentle airflow", kind: "experiment",
      what: "Drop-tower tests with thin paper showed that in low gravity a slow forced airflow, like the 8 to 20 cm/s of the Shuttle cabin, lets materials burn at lower oxygen, down to about 15 %.",
      lesson: "The 1989 review warned that ground flammability tests do not include this hazard of low gravity. BASS and BASS-II measured it in orbit starting in 2012.",
      answers: ["PSI-26", "PSI-25"], front: "prevention",
      source: "Friedman and Olson, Fire Safety Applications for Spacecraft, NASA TM-101463 (1989), pp. 7 and 10", url: "https://ntrs.nasa.gov/citations/19890015042" },
    { year: "1997", title: "Fire aboard Mir", kind: "accident",
      what: "A solid-fuel oxygen generator ignited. The flame lasted several minutes and finally went out on its own; smoke filled the modules and took hours to clear.",
      lesson: "The lessons went into the design and operations of the International Space Station.",
      answers: ["PSI-102", "PSI-101", "PSI-69"], front: "detection",
      source: "NASA, 25 Years Ago: Fire Aboard Space Station Mir (published February 23, 2022)", url: "https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/" },
    { year: "2007", title: "SAME measures smoke in orbit", kind: "experiment",
      what: "Particle size and detector response for smoke made in microgravity.",
      lesson: "Smoke particles in microgravity are a few hundred nanometers across: the report gives count mean diameters of 100 to 200 nm, and 227 nm for silicone.",
      answers: ["PSI-102"], front: "detection", source: "PSI-102", url: "" },
    { year: "2009", title: "FLEX starts burning droplets with suppressants", kind: "experiment",
      what: "274 droplet tests through 2011 with carbon dioxide and helium.",
      lesson: "Extinction, disruption or complete burning recorded for each test.",
      answers: ["PSI-69"], front: "suppression", source: "PSI-69", url: "" },
    { year: "2012", title: "BASS and BASS-II burn solids", kind: "experiment",
      what: "251 tests on solid materials in PSI through 2018, always at 22.7 % oxygen or less.",
      lesson: "The flammability boundary is U-shaped against airflow.",
      answers: ["PSI-26", "PSI-25"], front: "prevention", source: "PSI-26 and PSI-25", url: "" },
    { year: "2019", title: "ACME BRE tests exploration atmospheres", kind: "experiment",
      what: "177 flames through 2021 in the three atmospheres NASA considers for crewed missions.",
      lesson: "At Moon-base-like conditions, flames generally persisted instead of going out.",
      answers: ["PSI-20"], front: "prevention", source: "PSI-20", url: "" },
    { year: "2023", title: "Saffire VI burns solids in near Moon-base air", kind: "experiment",
      what: "Inside a Cygnus cargo ship, after it left the Station, SIBAL fabric and PMMA burned at 28.8 to 31.0 % oxygen and about 55 kPa (8 psi), almost the Moon-base air of the challenge (34 % and 8.2 psi). Outside PSI.",
      lesson: "Preliminary results: in the PMMA tests cabin carbon monoxide passed its 24-hour limit, and the smoke was readily detected at 981 s, after most of the hazardous gas had been released.",
      answers: [], front: "detection",
      source: "Urban et al., Preliminary Results from the Saffire VI Experiment, ICES 2024, NASA Glenn (NTRS 20240007488)", url: "https://ntrs.nasa.gov/citations/20240007488" },
    { year: "Recent", title: "Smoke alarm on Artemis II", kind: "accident",
      what: "A smoke alarm went off about 80,000 miles from home.",
      lesson: "Detection has to work, and be trusted, far from any help.",
      answers: ["PSI-101", "PSI-102"], front: "detection", source: "Challenge statement", url: "" },
    { year: "Future", title: "LUCI and FM2", kind: "planned",
      what: "Lunar-g Combustion Investigation, and Flammability of Materials on the Moon (FM2): a self-contained chamber meant to burn two cotton-fiberglass fabrics and two acrylic rods on the lunar surface, at 21 % oxygen and 14.7 psia and at 34 % and 8.2 psia.",
      lesson: "The challenge expects them to add the first partial-gravity data to PSI. A 2024 FM2 poster says centrifuge drops of 5.18 seconds already suggest some materials burn at lower oxygen in lunar gravity than on Earth.",
      answers: [], front: "prevention",
      source: "Challenge statement; FM2 poster, Glenn Space Technology Symposium, July 2024 (NTRS 20240008623)", url: "https://ntrs.nasa.gov/citations/20240008623" }
  ],

  materials: {
    "PMMA (acrylic)": "The most-tested solid in PSI: rods, spheres and sheets across BASS, BASS-II and Saffire-II. PSI has no smoke data for it. Outside PSI, Saffire VI burned 1 cm and 0.5 cm PMMA at 30.3 and 28.8 % oxygen near 55 kPa, and cabin carbon monoxide rose above its 24-hour limit (preliminary, ICES 2024).",
    "SIBAL (cotton-fiberglass fabric)": "Tested in five investigations, from narrow strips in the glovebox to the 94 cm sheets of Saffire. PSI has no smoke data for it. Outside PSI, Saffire VI burned a SIBAL sheet at 31.0 % oxygen and 54.1 kPa (preliminary, ICES 2024).",
    "Kapton": "Only smoke data. It makes the smallest particles and the weakest detector response; the SAME-R report says its smoke will be hard to detect with light scattering.",
    "Silicone": "It barely burned in microgravity in Saffire-II, yet it makes the largest smoke particles and the strongest detector response. In normal gravity two of four samples burned completely.",
    "Teflon": "Only smoke data. The Station detector was erratic with its smoke, whose particles are smaller than one micrometer.",
    "Lampwick": "Only smoke data, from SAME and SAME-R.",
    "Wax": "Candle tests, almost all in BASS. There is no smoke data for it.",
    "Pyrell": "Only smoke data, from SAME-R. Its fresh smoke has the largest geometric mean diameter of the five materials, 149 nm.",
    "Nomex": "A few tests in BASS and BASS-II. In Saffire-II the Nomex part of a combined sample did not ignite. Outside PSI, a 2025 poster prepared for FM2 gives approximate limiting oxygen for Nomex HT90-40 fabric at 8.2 psi: about 23 % in normal gravity, 29 % in lunar gravity and 38 % in microgravity.",
    "Ultem": "Two tests in BASS."
  },

  /* Saved answers for the question box. They work with no network and were checked against the data. */
  examples: [
    { q: "What is known about fire in a Moon base atmosphere?",
      a: "71 tests ran in air like a Moon base, with 30 % oxygen or more at 11 psi or less, and none of them with solids: 34 gas flames from ACME BRE [PSI-20], 20 from ACME CFI-G [PSI-159] and 17 droplets from FLEX [PSI-69]. In BRE, near 8.2 psia with 29.8 to 39.3 % oxygen, 25 of 36 flames kept burning until the fuel was cut off, while near 14.7 psia with less than 23 % oxygen all 10 went out by themselves. The final report says the same in words [bre-final-18]. The figure shows one of those flames, still burning steadily at 172 seconds with 34 % oxygen and 8.2 psia.\n\n[[figure:bre-p57-fig6]]\n\nNo fabric or plastic has been burned in that air in the data PSI holds. Outside PSI, NASA's Saffire VI burned a SIBAL sheet at 31.0 % oxygen and PMMA at 30.3 and 28.8 %, near 55 kPa (about 8 psi), almost Moon-base air; the results are preliminary and the test-by-test data are not open in PSI [saffire6-11]. Lunar gravity has only been reproduced for seconds at a time, in parabolic flights and in centrifuges inside drop towers [kc135-2003] [fm2poster-1-limits]; no long test is known in PSI or in the sources on this site." },
    { q: "Which smoke is hardest for the Station detector to see?",
      a: "Kapton and Teflon. In SAME-R the Station detector's obscuration signal changed by a median of 0.006 V with Kapton smoke and 0.019 V with Teflon, against 1.08 V with silicone. Their particles are the smallest: a median count mean diameter of 110 and 167 nm [PSI-101]. The SAME-R final report concludes that Kapton and Teflon smoke will be hard to detect with light-scattering devices, and in SAME the Station detector was erratic with Teflon smoke [PSI-102] [samer-5] [same-25]. The figure plots the particle diameters of Kapton smoke against air speed in SAME-R.\n\n[[figure:samer-p6-fig7]]\n\nThe detector figures are a coarse summary that ranks materials. They are not an alarm threshold." },
    { q: "Which suppressants were tested, and on what?",
      a: "Carbon dioxide and helium, on droplets of methanol and heptane. FLEX ran 274 tests and recorded extinction in 186, droplet disruption in 61 and complete burning in 27 [PSI-69]. On solids, BASS applied nitrogen in 7 tests, but the effect is described in text, not measured [PSI-26].\n\nWater mist, which the challenge mentions, is not in the data: PSI holds no water-mist test." },
    { q: "Is there data for a Mars habitat?",
      a: "That is not in the data. PSI holds no combustion test at partial gravity, and the challenge gives no atmosphere for a Mars habitat. The closest evidence sits at the two ends of the gravity scale: the microgravity flight tests, and Saffire-II, which repeated 9 samples in normal gravity [PSI-99]. The figure, from NASA's guide to combustion science on the Station, sets flames in normal gravity beside flames of the same fuels in microgravity.\n\n[[figure:guide-p9-fig1]]\n\nACME E-FIELD Flames suggests that electric fields could approximate partial-gravity buoyancy; that is a suggestion in its report, not a measurement [PSI-22] [efield-37]. The challenge names two future experiments, LUCI and FM2." },
    { q: "Does silicone burn?",
      a: "In microgravity, barely: the four silicone samples of Saffire-II did not spread flame, with a burn length of about 0 [PSI-99]. In normal gravity the same samples behaved differently: two burned completely, one burned 7.6 cm and one did not burn.\n\nSilicone does make smoke when overheated. In SAME and SAME-R it produced the largest particles and the strongest response of the Station detector [PSI-101] [PSI-102]. The figure shows the instrument traces of one silicone smoke run in SAME. Its flame tests in Saffire-II ran at 21.5 to 22.1 % oxygen and its smoke runs do not record oxygen, so PSI holds nothing about it in Moon-base air.\n\n[[figure:same-p27-fig13]]" }
  ],

  sources: {
    psi: "NASA Physical Sciences Informatics (PSI) Data Repository, downloaded November 13, 2026",
    guide: "A Researcher's Guide to International Space Station Combustion Science, NASA, 2015",
    disclaimer: "A student project for the 2026 NASA Space Apps Challenge. Not affiliated with or endorsed by NASA."
  }
};
