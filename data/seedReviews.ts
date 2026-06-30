export type SeedReview = {
  id: string;
  handle: string;
  date: string;
  rating: number;
  text: string;
  wouldReturn: boolean;
};

export const SEED_REVIEWS: Record<string, SeedReview[]> = {
  r001: [
    { id: 's_r001_1', handle: 'roll_queen_nj', date: '2026-05-14', rating: 4, text: 'Solid lunch spot. Sashimi was fresh, got through maybe 4 rounds before the time limit. Service is fast which I appreciate.', wouldReturn: true },
    { id: 's_r001_2', handle: 'sashimi_steve', date: '2026-04-02', rating: 5, text: 'Best value in Palisades Park. The tuna here is legit. Went with 6 people and everyone was happy.', wouldReturn: true },
    { id: 's_r001_3', handle: 'wasabi.warrior', date: '2026-03-19', rating: 4, text: "Matsu is reliable. Nothing crazy but everything is fresh and they don't rush you out.", wouldReturn: true },
  ],
  r002: [
    { id: 's_r002_1', handle: 'edamame_earl', date: '2026-05-28', rating: 4, text: 'Good spot for the price. Rolls are a bit small but the nigiri makes up for it. BYOB would make this a 5 star.', wouldReturn: true },
    { id: 's_r002_2', handle: 'flushing_fan', date: '2026-04-15', rating: 3, text: 'Fine, nothing special. Salmon was a bit warm on my last visit. Might just be an off night.', wouldReturn: false },
  ],
  r003: [
    { id: 's_r003_1', handle: 'byo_baron', date: '2026-06-01', rating: 4, text: 'Great for groups. Hot pot + sushi combo is underrated. We stayed the full 90 min.', wouldReturn: true },
    { id: 's_r003_2', handle: 'ayces_up', date: '2026-05-10', rating: 4, text: 'Hot pot selection is solid. Broth options could be better but the sushi side is fresh. Good deal.', wouldReturn: true },
    { id: 's_r003_3', handle: 'nori_nate', date: '2026-03-27', rating: 5, text: 'Took the whole family here for my birthday. We literally rolled out. 10/10 experience.', wouldReturn: true },
  ],
  r004: [
    { id: 's_r004_1', handle: 'hudson_rolls', date: '2026-04-22', rating: 4, text: 'Nice vibe for a date night. Smaller menu than the other PP spots but quality is noticeably better.', wouldReturn: true },
    { id: 's_r004_2', handle: 'roll_queen_nj', date: '2026-02-08', rating: 4, text: 'Cozy atmosphere. Good for couples. The omakase roll is legit.', wouldReturn: true },
  ],
  r005: [
    { id: 's_r005_1', handle: 'wasabi.warrior', date: '2026-06-10', rating: 4, text: 'Fort Lee classic. Been coming here for years. The salmon nigiri is always on point.', wouldReturn: true },
    { id: 's_r005_2', handle: 'sashimi_steve', date: '2026-05-03', rating: 5, text: 'Best AYCE in Fort Lee. Period. Service is quick and the fish quality is better than Palisades Park IMO.', wouldReturn: true },
    { id: 's_r005_3', handle: 'ayces_up', date: '2026-03-14', rating: 4, text: 'Really solid. Lunch deal is a steal. Gets crowded on weekends so go early.', wouldReturn: true },
  ],
  r006: [
    { id: 's_r006_1', handle: 'edamame_earl', date: '2026-05-20', rating: 3, text: 'Decent. A bit inconsistent — great one visit, meh the next. Good for when you want quick and cheap.', wouldReturn: true },
    { id: 's_r006_2', handle: 'byo_baron', date: '2026-04-07', rating: 4, text: 'Good no-frills AYCE. No reservations so the wait can suck on Friday nights but worth it.', wouldReturn: true },
  ],
  r007: [
    { id: 's_r007_1', handle: 'flushing_fan', date: '2026-06-15', rating: 4, text: 'Solid Queens spot. Rolls are creative and generous. Lunch deal is one of the best in the borough.', wouldReturn: true },
    { id: 's_r007_2', handle: 'nori_nate', date: '2026-05-11', rating: 4, text: 'Good value. Not the fanciest place but fish is fresh and they keep it coming.', wouldReturn: true },
  ],
  r008: [
    { id: 's_r008_1', handle: 'roll_queen_nj', date: '2026-06-05', rating: 4, text: 'Classic Flushing AYCE. The beef and shrimp dishes are underrated. Good for big groups.', wouldReturn: true },
    { id: 's_r008_2', handle: 'sashimi_steve', date: '2026-04-29', rating: 4, text: 'Always a reliable pick when I am in Flushing. Gets busy on weekends, go early.', wouldReturn: true },
    { id: 's_r008_3', handle: 'wasabi.warrior', date: '2026-02-17', rating: 5, text: 'Best lunch AYCE in Flushing imo. Fish is super fresh and the rolls are huge.', wouldReturn: true },
  ],
  r009: [
    { id: 's_r009_1', handle: 'ayces_up', date: '2026-06-20', rating: 4, text: 'Premium selection, worth the extra few bucks. Yellowtail and toro are standouts.', wouldReturn: true },
    { id: 's_r009_2', handle: 'edamame_earl', date: '2026-05-08', rating: 5, text: 'Reservations required but absolutely worth planning ahead. Best sashimi quality in Queens AYCE.', wouldReturn: true },
    { id: 's_r009_3', handle: 'flushing_fan', date: '2026-03-22', rating: 4, text: 'Imperial is on another level for AYCE. Had hamachi belly that was insane. Pricier but justified.', wouldReturn: true },
  ],
  r010: [
    { id: 's_r010_1', handle: 'sashimi_steve', date: '2026-06-18', rating: 5, text: 'Mono+Mono is on another level. Not your typical AYCE. The nigiri quality rivals omakase spots and you can order unlimited. Worth every cent.', wouldReturn: true },
    { id: 's_r010_2', handle: 'wasabi.warrior', date: '2026-05-25', rating: 5, text: 'Came on a Friday night with my girlfriend. The ambient lighting, the fish quality — genuinely premium. Hard to believe this is AYCE.', wouldReturn: true },
    { id: 's_r010_3', handle: 'roll_queen_nj', date: '2026-04-12', rating: 4, text: 'Really good. The sake pairing makes it special. Not cheap but for Manhattan AYCE this is the move.', wouldReturn: true },
    { id: 's_r010_4', handle: 'ayces_up', date: '2026-02-14', rating: 5, text: 'Valentine day dinner here was perfect. Chef really cares. Bluefin toro was unreal.', wouldReturn: true },
  ],
  r011: [
    { id: 's_r011_1', handle: 'nori_nate', date: '2026-06-08', rating: 4, text: 'Great late night option in the city. Rolls are solid and the vibe is chill. Good for after drinks.', wouldReturn: true },
    { id: 's_r011_2', handle: 'hudson_rolls', date: '2026-04-18', rating: 4, text: 'Yuki is my go-to when I want AYCE without a reservation. Quality is consistent.', wouldReturn: true },
  ],
  r012: [
    { id: 's_r012_1', handle: 'byo_baron', date: '2026-05-31', rating: 4, text: 'Jersey City finally has a decent AYCE spot. Fresh fish and the price is right. No BYOB though.', wouldReturn: true },
    { id: 's_r012_2', handle: 'roll_queen_nj', date: '2026-04-25', rating: 4, text: 'Great neighborhood spot. Convenient for JC residents. Not as cheap as NJ BYOB places but solid.', wouldReturn: true },
  ],
  r013: [
    { id: 's_r013_1', handle: 'byo_baron', date: '2026-06-12', rating: 4, text: 'BYOB and under $30? This is the move for a date night in Bergen County. Bring a nice bottle and enjoy.', wouldReturn: true },
    { id: 's_r013_2', handle: 'wasabi.warrior', date: '2026-05-06', rating: 5, text: 'Sushi X is criminally underrated. The fish quality for the price is insane. Bring your own wine and its a 10/10 night.', wouldReturn: true },
    { id: 's_r013_3', handle: 'edamame_earl', date: '2026-03-30', rating: 4, text: 'Really good BYOB option. The spicy tuna here is legit. Always come back.', wouldReturn: true },
  ],
  r014: [
    { id: 's_r014_1', handle: 'ayces_up', date: '2026-05-18', rating: 4, text: 'Miga Denville is the best BYOB AYCE in Morris County. Closed Mondays but worth planning around.', wouldReturn: true },
    { id: 's_r014_2', handle: 'sashimi_steve', date: '2026-04-04', rating: 4, text: 'Family friendly and great value. Sashimi is really fresh. The parking lot makes it easy too.', wouldReturn: true },
  ],
  r015: [
    { id: 's_r015_1', handle: 'nori_nate', date: '2026-06-03', rating: 4, text: 'Wayne location is just as good as Denville. Easy to get to off 46. BYOB is the move.', wouldReturn: true },
    { id: 's_r015_2', handle: 'flushing_fan', date: '2026-03-11', rating: 4, text: 'Solid AYCE. The sashimi platter is really fresh. Easy parking.', wouldReturn: true },
  ],
  r016: [
    { id: 's_r016_1', handle: 'roll_queen_nj', date: '2026-05-22', rating: 4, text: 'Hidden gem in Little Falls. BYOB, good fish, and easy parking. What more do you need.', wouldReturn: true },
    { id: 's_r016_2', handle: 'byo_baron', date: '2026-04-10', rating: 5, text: 'One of the best BYOB setups around. Bring a case of Sapporo and go to town. Great value.', wouldReturn: true },
    { id: 's_r016_3', handle: 'hudson_rolls', date: '2026-02-28', rating: 4, text: 'Sushi Village is reliable. Been going for 3 years, always consistent. The spider roll is great.', wouldReturn: true },
  ],
  r017: [
    { id: 's_r017_1', handle: 'wasabi.warrior', date: '2026-05-29', rating: 4, text: 'Small and cozy BYOB spot. The fish is super fresh — they must get good suppliers. Affordable too.', wouldReturn: true },
    { id: 's_r017_2', handle: 'edamame_earl', date: '2026-04-16', rating: 4, text: 'Arigato is a sleeper pick. Not many people know about it but the quality is there.', wouldReturn: true },
  ],
  r018: [
    { id: 's_r018_1', handle: 'ayces_up', date: '2026-06-14', rating: 4, text: 'Yuki Hana in Woodland Park is legit. Closed Mondays. Go Tuesday-Sunday and bring your own wine.', wouldReturn: true },
    { id: 's_r018_2', handle: 'sashimi_steve', date: '2026-05-02', rating: 4, text: 'Good spot. The rainbow roll is solid. Would like a few more sashimi options but can not complain at this price.', wouldReturn: true },
  ],
  r019: [
    { id: 's_r019_1', handle: 'nori_nate', date: '2026-05-25', rating: 4, text: 'South Hackensack location on Rt 46 is convenient. BYOB, decent fish. Closed Tuesdays FYI.', wouldReturn: true },
    { id: 's_r019_2', handle: 'hudson_rolls', date: '2026-03-08', rating: 3, text: 'Decent but not as good as the Little Falls location. Service was a bit slow. Still good value.', wouldReturn: true },
  ],
  r020: [
    { id: 's_r020_1', handle: 'roll_queen_nj', date: '2026-06-07', rating: 4, text: 'Pearl River is a solid option if you are in Rockland County. Good value and decent fish quality.', wouldReturn: true },
    { id: 's_r020_2', handle: 'byo_baron', date: '2026-04-21', rating: 4, text: 'Sakura Pearl River is a nice change of pace from NJ spots. NY prices but still reasonable.', wouldReturn: true },
  ],
  r021: [
    { id: 's_r021_1', handle: 'ayces_up', date: '2026-06-25', rating: 4, text: 'A Sushi opened recently in Carlstadt — really good and BYOB. Fresh fish, fair price. This one has a lot of potential.', wouldReturn: true },
    { id: 's_r021_2', handle: 'wasabi.warrior', date: '2026-06-12', rating: 5, text: 'New spot alert! A Sushi in Carlstadt is doing things right. Modern vibe, great fish. Already my new favorite in Bergen County.', wouldReturn: true },
  ],
  r022: [
    { id: 's_r022_1', handle: 'sashimi_steve', date: '2026-05-17', rating: 4, text: 'Arigato Edgewater has a great location on the river. Dinner-only, BYOB. No sashimi in the AYCE but the rolls and nigiri are solid.', wouldReturn: true },
    { id: 's_r022_2', handle: 'edamame_earl', date: '2026-04-03', rating: 4, text: 'Really nice atmosphere and good quality. River Rd views are a bonus. Get there early.', wouldReturn: true },
  ],
  r023: [
    { id: 's_r023_1', handle: 'nori_nate', date: '2026-06-19', rating: 4, text: 'Kikoo is the go-to late night AYCE in the East Village. 18% auto gratuity is annoying but the food makes up for it.', wouldReturn: true },
    { id: 's_r023_2', handle: 'hudson_rolls', date: '2026-05-13', rating: 5, text: 'Love Kikoo. The variety is insane for AYCE. Went at 10pm on a Saturday and still fresh. NYC come through.', wouldReturn: true },
    { id: 's_r023_3', handle: 'roll_queen_nj', date: '2026-04-09', rating: 4, text: 'Good spot for groups. Gets loud and fun. The signature rolls are really creative.', wouldReturn: true },
  ],
  r024: [
    { id: 's_r024_1', handle: 'sashimi_steve', date: '2026-06-21', rating: 5, text: 'Sushi Hayashi is in a league of its own. \$98 sounds steep but you are getting omakase-quality fish you can order unlimited. Absolutely worth it.', wouldReturn: true },
    { id: 's_r024_2', handle: 'wasabi.warrior', date: '2026-05-30', rating: 5, text: 'Only 10 seats, tight reservations on Resy, but my god. The bluefin here is transcendent. This is not regular AYCE.', wouldReturn: true },
    { id: 's_r024_3', handle: 'ayces_up', date: '2026-04-26', rating: 4, text: 'Special occasion spot. The sake included makes it feel like a real deal. Staff is incredibly attentive.', wouldReturn: true },
    { id: 's_r024_4', handle: 'roll_queen_nj', date: '2026-03-05', rating: 5, text: 'Best AYCE I have ever had. It does not even feel like AYCE. Felt like we were at a \$200/head omakase.', wouldReturn: true },
  ],
  r025: [
    { id: 's_r025_1', handle: 'edamame_earl', date: '2026-05-23', rating: 4, text: 'Osaka Tenafly is solid. BYOB, fair price, good fish. The lobster roll is a must-order.', wouldReturn: true },
    { id: 's_r025_2', handle: 'byo_baron', date: '2026-04-11', rating: 4, text: 'One of the nicer BYOB spots in NJ. The dining room is comfortable and they are not rushing you.', wouldReturn: true },
  ],
  r026: [
    { id: 's_r026_1', handle: 'nori_nate', date: '2026-06-16', rating: 4, text: 'Asahi in Norwood is a great find. Really fresh for the price. BYOB makes it even better.', wouldReturn: true },
    { id: 's_r026_2', handle: 'hudson_rolls', date: '2026-04-27', rating: 4, text: 'Good local AYCE. Nothing flashy but reliable quality and friendly staff.', wouldReturn: true },
  ],
  r027: [
    { id: 's_r027_1', handle: 'flushing_fan', date: '2026-06-08', rating: 4, text: 'Rakuzen Borough Park is a great find in Brooklyn. \$31 flat for sushi and sashimi. Goes hard.', wouldReturn: true },
    { id: 's_r027_2', handle: 'sashimi_steve', date: '2026-05-15', rating: 4, text: 'Solid AYCE for Brooklyn. Not fancy but fresh. The salmon roll is consistently good.', wouldReturn: true },
    { id: 's_r027_3', handle: 'roll_queen_nj', date: '2026-04-01', rating: 4, text: 'Finally a real AYCE sushi spot in Brooklyn. The sashimi upgrade is worth it.', wouldReturn: true },
  ],
  r028: [
    { id: 's_r028_1', handle: 'wasabi.warrior', date: '2026-06-17', rating: 4, text: 'Elmhurst Rakuzen is bigger and faster service than the Brooklyn one. Easy to get a table.', wouldReturn: true },
    { id: 's_r028_2', handle: 'ayces_up', date: '2026-05-04', rating: 5, text: 'Best value AYCE in Queens that is not in Flushing. Fresh fish, big dining room, great for groups.', wouldReturn: true },
    { id: 's_r028_3', handle: 'edamame_earl', date: '2026-03-20', rating: 4, text: 'Went with 8 people. No wait, quick service, everyone happy. \$31 is fair for what you get.', wouldReturn: true },
  ],
  r029: [
    { id: 's_r029_1', handle: 'byo_baron', date: '2026-06-02', rating: 4, text: 'Las Vegas Sushi is a solid BYOB option in Fort Lee. \$38 is on the higher end for Bergen County but the fish justifies it.', wouldReturn: true },
    { id: 's_r029_2', handle: 'nori_nate', date: '2026-04-19', rating: 3, text: 'Good food but expensive for what it is. The location on Bergen Blvd is convenient though.', wouldReturn: true },
  ],
  r030: [
    { id: 's_r030_1', handle: 'hudson_rolls', date: '2026-05-27', rating: 4, text: 'Sushi Palace in Edison is great. The chain is consistent — always fresh, always fast. \$29 weekday is a deal.', wouldReturn: true },
    { id: 's_r030_2', handle: 'roll_queen_nj', date: '2026-04-14', rating: 4, text: 'Sushi Palace delivers every time. Edison location is easy to get to. Great for family dinners.', wouldReturn: true },
  ],
  r031: [
    { id: 's_r031_1', handle: 'wasabi.warrior', date: '2026-05-09', rating: 4, text: 'Somerville Sushi Palace is a gem for Central NJ. Downtown location is walkable. Great date night spot.', wouldReturn: true },
    { id: 's_r031_2', handle: 'sashimi_steve', date: '2026-03-26', rating: 4, text: 'Consistent quality across the Sushi Palace chain. Somerville is no different.', wouldReturn: true },
  ],
  r032: [
    { id: 's_r032_1', handle: 'ayces_up', date: '2026-06-11', rating: 4, text: 'Summit Sushi Palace pulls in the train commuter crowd and rightfully so. Convenient and good.', wouldReturn: true },
    { id: 's_r032_2', handle: 'edamame_earl', date: '2026-04-28', rating: 5, text: 'One of the better Sushi Palace locations. Downtown Summit is a nice setting for dinner.', wouldReturn: true },
  ],
  r033: [
    { id: 's_r033_1', handle: 'byo_baron', date: '2026-05-20', rating: 4, text: 'Princeton Sushi Palace is a great option for Central/South NJ. Same quality as the northern locations.', wouldReturn: true },
    { id: 's_r033_2', handle: 'flushing_fan', date: '2026-03-15', rating: 3, text: 'Kingston Mall location is a bit strip-mally but the food is solid. Good for a quick AYCE fix.', wouldReturn: true },
  ],
  r034: [
    { id: 's_r034_1', handle: 'nori_nate', date: '2026-06-22', rating: 4, text: 'East Hana JC has been my go-to since I moved to the Heights. Great value, close to the PATH.', wouldReturn: true },
    { id: 's_r034_2', handle: 'hudson_rolls', date: '2026-05-06', rating: 4, text: 'Finally a JC AYCE spot that can hold its own. Fresh fish and the staff is super nice.', wouldReturn: true },
    { id: 's_r034_3', handle: 'roll_queen_nj', date: '2026-04-02', rating: 4, text: 'Perfect for downtown JC. Walk to the waterfront after. Highly recommend.', wouldReturn: true },
  ],
  r035: [
    { id: 's_r035_1', handle: 'sashimi_steve', date: '2026-06-26', rating: 4, text: 'Sake Sushi in Gravesend is the best deal in all of NYC AYCE. \$20 dinner, 2 hours, no-frills. The fish is shockingly fresh for the price.', wouldReturn: true },
    { id: 's_r035_2', handle: 'wasabi.warrior', date: '2026-05-31', rating: 4, text: 'Tiny spot and there is always a wait but it is absolutely worth it. Bring cash.', wouldReturn: true },
    { id: 's_r035_3', handle: 'ayces_up', date: '2026-04-23', rating: 5, text: '\$13 lunch in NYC?? This spot is wild. Get there right when they open or prepare to wait.', wouldReturn: true },
    { id: 's_r035_4', handle: 'edamame_earl', date: '2026-02-20', rating: 3, text: 'Fish is fresh but the place is really cramped. Worth it for the price, just do not expect comfort.', wouldReturn: true },
  ],
  r036: [
    { id: 's_r036_1', handle: 'byo_baron', date: '2026-06-24', rating: 4, text: '66s Fusion near the Navy Yard is a step above typical AYCE. The rolls are creative and the fish is noticeably fresher.', wouldReturn: true },
    { id: 's_r036_2', handle: 'nori_nate', date: '2026-05-19', rating: 5, text: 'Went for a Friday dinner and this place delivered. \$36 for the quality they put out is genuinely fair for Brooklyn.', wouldReturn: true },
    { id: 's_r036_3', handle: 'flushing_fan', date: '2026-04-06', rating: 4, text: 'Closed Sundays, heads up. But Mon-Sat this is one of the best AYCE options in the borough.', wouldReturn: true },
  ],
  r037: [
    { id: 's_r037_1', handle: 'hudson_rolls', date: '2026-06-13', rating: 4, text: 'Sushi Village Westwood is the best AYCE in northern Bergen County. Weekend price is still \$28.99 which is unbeatable.', wouldReturn: true },
    { id: 's_r037_2', handle: 'roll_queen_nj', date: '2026-05-01', rating: 5, text: 'Been going here for years. Always consistent. The mango roll is my go-to.', wouldReturn: true },
    { id: 's_r037_3', handle: 'sashimi_steve', date: '2026-03-07', rating: 4, text: 'Westwood Sushi Village is solid. Easy parking, quick service, and AYCE that keeps up with the demand.', wouldReturn: true },
  ],
  r038: [
    { id: 's_r038_1', handle: 'brooklyn.rolls', date: '2026-06-11', rating: 4, text: 'Finally an AYCE on Staten Island worth the trip. Ginza in Bulls Head has solid fish and they actually keep up with orders.', wouldReturn: true },
    { id: 's_r038_2', handle: 'nori_nate', date: '2026-05-03', rating: 4, text: "Nice neighborhood spot. Closed Mondays, just FYI. The salmon rolls are consistently good every time I've been.", wouldReturn: true },
    { id: 's_r038_3', handle: 'ayces_up', date: '2026-04-12', rating: 3, text: 'Decent for SI. Not the most exciting menu but the price is fair and they are not stingy with refills.', wouldReturn: true },
  ],
  r039: [
    { id: 's_r039_1', handle: 'ayce.addict', date: '2026-06-08', rating: 4, text: "Fuji Sushi on Hylan is a solid SI hidden gem. Wed-Sun only. The $30 dinner price is totally fair for what you get.", wouldReturn: true },
    { id: 's_r039_2', handle: 'maki_mike', date: '2026-04-28', rating: 4, text: 'Good local AYCE. Nothing fancy but the fish is fresh and service is friendly. Go Sunday before 4pm.', wouldReturn: true },
  ],
  r040: [
    { id: 's_r040_1', handle: 'flushing_fan', date: '2026-06-14', rating: 4, text: 'UMI in Tremont is the move for Bronx AYCE. Hot pot + sushi combo and boba included? Wild value for $35.', wouldReturn: true },
    { id: 's_r040_2', handle: 'edamame_earl', date: '2026-05-22', rating: 4, text: 'Came here with 8 people. Hot pot broth options were decent, sushi side was solid. Great for groups.', wouldReturn: true },
    { id: 's_r040_3', handle: 'wasabi.warrior', date: '2026-04-05', rating: 5, text: 'Legit underrated. The Bronx needed this. Lunch $22.99 is one of the best deals in the entire city.', wouldReturn: true },
  ],
  r041: [
    { id: 's_r041_1', handle: 'queens_eats', date: '2026-06-20', rating: 5, text: 'Akino in Elmhurst is hands down one of the best AYCE spots in Queens. Fish quality rivals restaurants 3x the price.', wouldReturn: true },
    { id: 's_r041_2', handle: 'sashimi_steve', date: '2026-05-15', rating: 5, text: 'Been coming to Akino Elmhurst since they opened. The tuna cuts are thick, the hamachi is always fresh. Worth every dollar.', wouldReturn: true },
    { id: 's_r041_3', handle: 'spicy_tuna_gal', date: '2026-04-09', rating: 4, text: 'Great quality. Lunch $26 is a solid deal. Slightly cramped but the food makes up for it.', wouldReturn: true },
  ],
  r042: [
    { id: 's_r042_1', handle: 'flushing_fan', date: '2026-06-25', rating: 4, text: 'Akino Flushing has a slightly different vibe than Elmhurst — newer space, more modern. Same great fish quality.', wouldReturn: true },
    { id: 's_r042_2', handle: 'roll_queen_nj', date: '2026-05-30', rating: 5, text: 'Took a trip to Flushing specifically for this. The nigiri selection is phenomenal for AYCE. Will be back.', wouldReturn: true },
    { id: 's_r042_3', handle: 'nori_nate', date: '2026-04-18', rating: 4, text: 'Dinner $43 is a bit steep but the quality justifies it. The yellowtail alone is worth showing up for.', wouldReturn: true },
  ],
  r043: [
    { id: 's_r043_1', handle: 'queens_eats', date: '2026-06-07', rating: 4, text: 'New Sushi Village in Bayside is a local institution. Consistent, generous portions, good for big family dinners.', wouldReturn: true },
    { id: 's_r043_2', handle: 'spicy_tuna_gal', date: '2026-05-14', rating: 4, text: 'Solid Bayside AYCE. Nothing that will blow your mind but always fresh and reliable. Great parking.', wouldReturn: true },
    { id: 's_r043_3', handle: 'edamame_earl', date: '2026-03-27', rating: 3, text: 'Gets super crowded on weekends. Food is good but the wait can be long. Lunch on a weekday is the move.', wouldReturn: true },
  ],
  r044: [
    { id: 's_r044_1', handle: 'nigiri_net', date: '2026-05-28', rating: 4, text: 'River Japanese in Oakland Gardens is a neighborhood gem. $22 lunch deal is outstanding. Fish is always fresh.', wouldReturn: true },
    { id: 's_r044_2', handle: 'queens_eats', date: '2026-04-21', rating: 4, text: 'Underrated Bayside-area AYCE. Smaller menu than the big chains but quality feels more personal.', wouldReturn: true },
  ],
  r045: [
    { id: 's_r045_1', handle: 'wasabi.warrior', date: '2026-06-19', rating: 4, text: 'Kikoo UWS fills a real gap on the west side. $45 for unlimited nigiri and specialty rolls in this neighborhood is actually fair.', wouldReturn: true },
    { id: 's_r045_2', handle: 'omakase_or_bust', date: '2026-05-31', rating: 5, text: 'Way more chill than the EV location — no line, same quality fish. This is how I prefer to do Kikoo now.', wouldReturn: true },
    { id: 's_r045_3', handle: 'sashimi_steve', date: '2026-04-26', rating: 4, text: 'The UWS Kikoo is great for a date night. Quieter atmosphere, attentive service, and the hamachi is always perfectly cut.', wouldReturn: true },
  ],
  r046: [
    { id: 's_r046_1', handle: 'maki_mike', date: '2026-06-17', rating: 4, text: "Nova Asian Bistro in New Hyde Park is a solid LI find. $36 dinner with a solid menu. Don't sleep on the hibachi dishes.", wouldReturn: true },
    { id: 's_r046_2', handle: 'spicy_tuna_gal', date: '2026-05-04', rating: 3, text: "Good but not great. Service can be slow on weekends. The sashimi is decent, wouldn't say it's exceptional.", wouldReturn: true },
  ],
  r047: [
    { id: 's_r047_1', handle: 'byo_baron', date: '2026-06-22', rating: 4, text: 'Sushi Time 560 in Bethpage is a BYOB AYCE — this is the LI combo I needed. Bring a bottle of sake and enjoy $30 of endless sushi.', wouldReturn: true },
    { id: 's_r047_2', handle: 'lowkey_rice', date: '2026-05-10', rating: 4, text: 'BYOB Long Island AYCE, lunch $20. Honestly one of the best deals on the island. Very friendly staff.', wouldReturn: true },
    { id: 's_r047_3', handle: 'nigiri_net', date: '2026-03-15', rating: 4, text: 'Bethpage hidden gem. Consistent quality and the BYOB policy is a huge win. Get the tuna tataki.', wouldReturn: true },
  ],
  r048: [
    { id: 's_r048_1', handle: 'maki_mike', date: '2026-06-04', rating: 4, text: "Watawa in Bethpage is my go-to on Long Island. Weekday lunch under $25, quality fish. Service could be faster but I keep going back.", wouldReturn: true },
    { id: 's_r048_2', handle: 'refill_speedrun', date: '2026-04-30', rating: 4, text: 'Decent refill speed here. They have a system. Nigiri comes fast. Specialty rolls take a bit but worth it.', wouldReturn: true },
  ],
  r049: [
    { id: 's_r049_1', handle: 'lowkey_rice', date: '2026-06-01', rating: 4, text: "Sake Asian in Massapequa does sushi AND hibachi AYCE which is kind of rare. $30ish for both is a steal.", wouldReturn: true },
    { id: 's_r049_2', handle: 'spicy_tuna_gal', date: '2026-04-24', rating: 4, text: 'Good for families who have the hibachi kids and the sushi adults. Everyone eats well. Cash is slightly cheaper.', wouldReturn: true },
  ],
  r050: [
    { id: 's_r050_1', handle: 'hudson_rolls', date: '2026-06-23', rating: 4, text: 'Sushi Castle Eastchester is probably the best Westchester AYCE. $29.95 weekday, kids $15.95. This is what family dining should be.', wouldReturn: true },
    { id: 's_r050_2', handle: 'wasabi.warrior', date: '2026-05-16', rating: 5, text: 'Drove up from the Bronx specifically for this. The fish quality is noticeably above the NYC borough spots. Worth the Westchester trip.', wouldReturn: true },
    { id: 's_r050_3', handle: 'nori_nate', date: '2026-04-03', rating: 4, text: 'Great suburban AYCE experience. Spacious, parking, quality fish. Weekend prices still reasonable at $31.95.', wouldReturn: true },
  ],
  r051: [
    { id: 's_r051_1', handle: 'ayces_up', date: '2026-06-16', rating: 4, text: "Sushi Palace Yonkers is the classic big-group AYCE formula done right. Sushi + hibachi + Chinese dishes, $30 a head, everyone's happy.", wouldReturn: true },
    { id: 's_r051_2', handle: 'ayce.addict', date: '2026-05-07', rating: 4, text: 'Went for a birthday dinner with 12 people. They handled it well. Not the best fish quality but consistent and value-priced.', wouldReturn: true },
  ],
  r052: [
    { id: 's_r052_1', handle: 'roll_queen_nj', date: '2026-06-18', rating: 5, text: 'Sushi House Teaneck is genuinely one of the best value AYCE in all of NJ. $14.99 lunch is absurd in a good way. Fish is always fresh.', wouldReturn: true },
    { id: 's_r052_2', handle: 'bergen_bites', date: '2026-05-25', rating: 5, text: 'Bergen County locals know this spot. $22.99 dinner is the best deal in the area. Kids eat half price which is great.', wouldReturn: true },
    { id: 's_r052_3', handle: 'edamame_earl', date: '2026-04-13', rating: 4, text: "Teaneck's secret AYCE weapon. Lunch deal during the week is unbeatable. Staff is super warm.", wouldReturn: true },
  ],
  r053: [
    { id: 's_r053_1', handle: 'byo_baron', date: '2026-06-09', rating: 4, text: 'Picnic Sushi Fort Lee — BYOB dinner only, closed Sundays. Small spot but the fish quality is worth it. Cash is $25.', wouldReturn: true },
    { id: 's_r053_2', handle: 'bergen_bites', date: '2026-05-02', rating: 3, text: 'Short hours (5-9pm) make it hard to plan around but when you make it work, the food is solid. BYOB is a plus.', wouldReturn: true },
  ],
  r054: [
    { id: 's_r054_1', handle: 'wasabi.warrior', date: '2026-06-21', rating: 4, text: 'Miga Livingston is the third Miga and it does not disappoint. Same BYOB, same 90-min limit, same quality you expect from this brand.', wouldReturn: true },
    { id: 's_r054_2', handle: 'roll_queen_nj', date: '2026-05-18', rating: 5, text: 'Miga is just the best BYOB AYCE chain in NJ. Livingston location is convenient for Essex County. Fish is always on point.', wouldReturn: true },
    { id: 's_r054_3', handle: 'bergen_bites', date: '2026-04-07', rating: 4, text: 'Great addition to the Livingston dining scene. BYOB sushi AYCE is rare and Miga does it right. Closed Mondays.', wouldReturn: true },
  ],
  r055: [
    { id: 's_r055_1', handle: 'refill_speedrun', date: '2026-06-14', rating: 4, text: "Supra is the only conveyor belt AYCE in NJ that I know of. BYOB too. Linden might seem random but this place is genuinely fun.", wouldReturn: true },
    { id: 's_r055_2', handle: 'nori_nate', date: '2026-05-29', rating: 5, text: "Conveyor belt AYCE + BYOB = best Friday night concept. Lunch $21.99 on the kaiten belt is an experience. NJ slept on this.", wouldReturn: true },
    { id: 's_r055_3', handle: 'ayce.addict', date: '2026-04-19', rating: 4, text: "Unique format in NJ. The belt keeps flowing and you grab what you want. BYOB makes it a party. Good value at $33 dinner.", wouldReturn: true },
  ],
  r056: [
    { id: 's_r056_1', handle: 'jc_foodie', date: '2026-06-26', rating: 5, text: "Sakana New Brunswick has a robot waiter, iPad ordering, and AYCE sushi. In 2026 this is what we deserve. Fish is fresh, BYOB, ~$32 dinner.", wouldReturn: true },
    { id: 's_r056_2', handle: 'lowkey_rice', date: '2026-06-10', rating: 5, text: "Most tech-forward AYCE I've been to. Robot service, iPad tablets at the table. Rutgers students found the best deal in NB.", wouldReturn: true },
    { id: 's_r056_3', handle: 'wasabi.warrior', date: '2026-05-04', rating: 4, text: 'The novelty of robot delivery wears off but the food quality holds up. BYOB + solid sushi = winner.', wouldReturn: true },
  ],
  r057: [
    { id: 's_r057_1', handle: 'edamame_earl', date: '2026-06-19', rating: 4, text: "East Hana Metuchen is the underrated Middlesex County AYCE. $25 weekday is a steal. BYOB, easy parking.", wouldReturn: true },
    { id: 's_r057_2', handle: 'nori_nate', date: '2026-05-12', rating: 4, text: 'Solid neighborhood sushi AYCE. The yellowtail is always fresh. Weekend price $32 is fair. Staff is very attentive.', wouldReturn: true },
  ],
  r058: [
    { id: 's_r058_1', handle: 'roll_queen_nj', date: '2026-06-22', rating: 4, text: 'Sakana East Hanover has iPad ordering and it is exactly what Route 10 needed. BYOB AYCE for Morris County. ~$33/person is fair.', wouldReturn: true },
    { id: 's_r058_2', handle: 'bergen_bites', date: '2026-05-19', rating: 4, text: 'Good suburban NJ AYCE. Modern setup, clean space, BYOB. The tuna and salmon are always fresh. Easy parking off Route 10.', wouldReturn: true },
  ],
  r059: [
    { id: 's_r059_1', handle: 'tampa.sushi.fan', date: '2026-06-24', rating: 4, text: 'Ajisai near USF is the Tampa AYCE institution. $30 flat, student discount, open late. This is the spot.', wouldReturn: true },
    { id: 's_r059_2', handle: 'sashimi_steve', date: '2026-05-31', rating: 4, text: 'Came down to Tampa for a weekend and hit Ajisai. Good fish, solid rolls, late night hours are a huge plus. Way better than I expected.', wouldReturn: true },
    { id: 's_r059_3', handle: 'ayces_up', date: '2026-04-14', rating: 5, text: 'One of the best AYCE spots in Florida period. Fish quality is genuinely good and USF ID gets you a discount. Go late on a weeknight.', wouldReturn: true },
  ],
  r060: [
    { id: 's_r060_1', handle: 'tampa.sushi.fan', date: '2026-06-17', rating: 4, text: 'Sushi Yama in Brandon is the East Tampa AYCE go-to. Hibachi + sushi in one and lunch is under $22. Great for families.', wouldReturn: true },
    { id: 's_r060_2', handle: 'wasabi.warrior', date: '2026-05-22', rating: 4, text: 'Solid Florida AYCE. The hibachi selections are the standout — good teriyaki dishes alongside quality sushi. Good deal overall.', wouldReturn: true },
  ],
  r061: [
    { id: 's_r061_1', handle: 'toro.enjoyer', date: '2026-06-27', rating: 5, text: 'Kingdom Sushi South Tampa is on another level. Brazilian-Japanese AYCE concept, toro on the menu, desserts included. $41 dinner is justified.', wouldReturn: true },
    { id: 's_r061_2', handle: 'omakase_or_bust', date: '2026-06-13', rating: 5, text: 'Best AYCE in the entire Tampa Bay area. The premium cuts at $40 are insane value. Felt like real omakase quality.', wouldReturn: true },
    { id: 's_r061_3', handle: 'tampa.sushi.fan', date: '2026-05-08', rating: 5, text: 'Kingdom is the crown jewel of Tampa AYCE. Lunch $32.90 is still a lot but the quality absolutely justifies it.', wouldReturn: true },
    { id: 's_r061_4', handle: 'sashimi_steve', date: '2026-04-22', rating: 4, text: 'Worth every cent. The bluefin toro at an AYCE is genuinely unusual. Late night friendly too.', wouldReturn: true },
  ],
  r062: [
    { id: 's_r062_1', handle: 'tampa.sushi.fan', date: '2026-06-15', rating: 4, text: 'Saki Endless Carrollwood is the best deal in North Tampa. Lunch $16.99 for sushi + hibachi is wild. My regular spot.', wouldReturn: true },
    { id: 's_r062_2', handle: 'flushing_fan', date: '2026-05-27', rating: 4, text: 'Visited Tampa for work and found this. $17 lunch endless sushi + hibachi is the kind of value that does not exist back home in Queens.', wouldReturn: true },
    { id: 's_r062_3', handle: 'lowkey_rice', date: '2026-04-30', rating: 4, text: 'Best budget AYCE in Tampa. You cannot beat $22 dinner for endless hibachi and sushi. Get the salmon teriyaki.', wouldReturn: true },
  ],
  r063: [
    { id: 's_r063_1', handle: 'toro.enjoyer', date: '2026-06-20', rating: 4, text: 'Shogun Hyde Park has creative rolls that you do not normally see at AYCE spots. Pepper Tuna and Sushi Tacos are real standouts.', wouldReturn: true },
    { id: 's_r063_2', handle: 'spicy_tuna_gal', date: '2026-05-24', rating: 4, text: 'Fun spot in South Tampa. The creative rolls make it feel less like a typical AYCE grind. Lunch is ~$22 which is fair.', wouldReturn: true },
  ],
  r064: [
    { id: 's_r064_1', handle: 'tampa.sushi.fan', date: '2026-06-10', rating: 4, text: 'Koizi New Tampa is the neighborhood staple. $14 lunch on Sundays all day is the best deal in Tampa Bay. Closed Tuesdays.', wouldReturn: true },
    { id: 's_r064_2', handle: 'ayce.addict', date: '2026-05-15', rating: 4, text: 'Best price point AYCE in Florida. $19.95 dinner for sushi + hibachi is hard to beat. Quality is solid for the price.', wouldReturn: true },
    { id: 's_r064_3', handle: 'refill_speedrun', date: '2026-04-18', rating: 4, text: 'Fast and efficient. Orders come out quick. The hibachi items help pad the wait for sushi. Good system.', wouldReturn: true },
  ],
  r065: [
    { id: 's_r065_1', handle: 'tampa.sushi.fan', date: '2026-06-05', rating: 4, text: "Umami in St. Pete near Tyrone is the best AYCE on the Pinellas County side. $20 lunch, $29 dinner, sushi + hibachi. Great spot.", wouldReturn: true },
    { id: 's_r065_2', handle: 'toro.enjoyer', date: '2026-05-20', rating: 4, text: "Good St Pete option. Fish quality is above average for Florida AYCE. The salmon nigiri here is properly cut.", wouldReturn: true },
  ],
  r066: [
    { id: 's_r066_1', handle: 'tampa.sushi.fan', date: '2026-06-12', rating: 4, text: "Saki Clearwater hits the mark for that side of Tampa Bay. $17 lunch near Clearwater Mall, quick service, solid sushi.", wouldReturn: true },
    { id: 's_r066_2', handle: 'flushing_fan', date: '2026-05-06', rating: 4, text: "Visiting Clearwater Beach and stumbled onto this. Endless sushi in Florida for $23 dinner?? I should move here.", wouldReturn: true },
  ],
  r067: [
    { id: 's_r067_1', handle: 'tampa.sushi.fan', date: '2026-06-03', rating: 4, text: "Saki Palm Harbor keeps the same formula going north into Pinellas County. Lunch $17, dinner $22. Consistent and reliable.", wouldReturn: true },
    { id: 's_r067_2', handle: 'maki_mike', date: '2026-04-25', rating: 3, text: "Fine for the area but service can be a bit slow. Fish is decent. Good if you live up in Palm Harbor and do not want to drive to Tampa.", wouldReturn: true },
  ],
  r068: [
    { id: 's_r068_1', handle: 'toro.enjoyer', date: '2026-06-25', rating: 4, text: "Ginza New Tampa has the best lunch deal in all of Tampa Bay — $12.95 for 200+ item AYCE. This is absurd value. Closed Tuesdays.", wouldReturn: true },
    { id: 's_r068_2', handle: 'tampa.sushi.fan', date: '2026-06-08', rating: 4, text: "New Tampa's other great AYCE option alongside Koizi. Ginza is a bit more traditional — less trendy, more substance.", wouldReturn: true },
    { id: 's_r068_3', handle: 'ayces_up', date: '2026-05-14', rating: 5, text: "$12.95 lunch in 2026. I had to come here just to verify it was real. It's real and it's good. Go before they raise prices.", wouldReturn: true },
  ],
};
