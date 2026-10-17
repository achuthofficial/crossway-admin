// Demo data for the CrossWay Command prototype. Everything is static; no backend.
export const NAV=[['dashboard','Dashboard','space_dashboard'],['liveops','Live operations','sensors'],['reqs','Requisitions','work'],['candidates','Candidates','groups'],['verification','Verification','verified_user'],['attendance','Attendance','schedule'],['billing','Billing','receipt_long'],['payroll','Payroll & payouts','payments'],['growth','Growth','trending_up'],['fraud','Fraud & quality','gpp_maybe'],['compliance','Compliance & audit','policy'],['support','Support desk','support_agent'],['config','Configuration','settings']];
export const ALL=NAV.map(n=>n[0]);
export const ROLES=[{id:'super',label:'Super Admin',s:ALL},{id:'city',label:'City Manager',s:ALL.filter(x=>x!=='config')},{id:'ops',label:'Operations Executive',s:['dashboard','liveops','reqs','candidates','attendance','support']},{id:'recruiter',label:'Recruiter',s:['dashboard','reqs','candidates','verification']},{id:'finance',label:'Finance',s:['dashboard','billing','payroll','compliance']},{id:'support',label:'Support Agent',s:['support','candidates']}];
export const T={ok:['#C4EED0','#072711'],warn:['#FEEFC3','#594300'],bad:['#F9DEDC','#410E0B'],info:['#D3E3FD','#041E49'],mute:['#E9EEF6','#444746']};
export const NFG={ok:'#444746',warn:'#7A5900',bad:'#B3261E',info:'#0B57D0',mute:'#444746'};
export const SHIFTS=[
{id:'SH-4102',client:'Toit Brewpub',site:'Indiranagar',role:'Waiter ×2',time:'18:00–00:00',worker:'Unassigned',status:'unassigned',note:'Starts in 1 h 40 m. Standby pool empty within 5 km.',sev:'bad'},
{id:'SH-4107',client:'Decathlon',site:'Sarjapur Rd',role:'Store helper',time:'16:00–22:00',worker:'Unassigned',status:'unassigned',note:'Autopilot invited 14, none accepted. Pay is ₹90 below the area median.',sev:'warn'},
{id:'SH-4088',client:'Taj MG Road',site:'MG Road',role:'Banquet server',time:'17:00–23:00',worker:'Deepa R.',status:'confirmed',note:'No-show risk 68%. Two reminders unread.',sev:'warn'},
{id:'SH-4091',client:'Flipkart FC',site:'Hoskote',role:'Picker',time:'14:00–22:00',worker:'Manjunath S.',status:'confirmed',note:'Confirmed 2 days ago · reliability 91.',sev:'ok'},
{id:'SH-4075',client:'Prestige Tech Park',site:'Whitefield',role:'Housekeeping',time:'07:00–15:00',worker:'Lakshmi D.',status:'checkedin',note:'Checked in 07:02 · selfie match 96%.',sev:'ok'},
{id:'SH-4079',client:'Flipkart FC',site:'Hoskote',role:'Loader',time:'09:00–17:00',worker:'Imran P.',status:'checkedin',note:'Checked in 340 m outside the geofence. Waiting for review.',sev:'warn'},
{id:'SH-4093',client:'Third Wave Coffee',site:'Koramangala',role:'Barista',time:'16:00–22:00',worker:'Kiran B.',status:'late',note:'18 min late. Calls unanswered. Last GPS 4.1 km away.',sev:'bad'},
{id:'SH-4064',client:'Taj MG Road',site:'MG Road',role:'Kitchen steward',time:'15:30–23:30',worker:'Suresh M.',status:'noshow',note:'Auto-backup Arun T. en route, ETA 22 min. Inside the free replacement window.',sev:'warn'},
{id:'SH-4069',client:'Decathlon',site:'Sarjapur Rd',role:'Cashier',time:'15:30–21:30',worker:'Neha P.',status:'noshow',note:'No backup accepted. Replacement SLA breaches in 12 min.',sev:'bad'}];
export const BACKUPS=[{id:'b1',name:'Arun T.',match:91,dist:'2.1 km',rel:93,st:'ok'},{id:'b2',name:'Sanjay V.',match:87,dist:'3.8 km',rel:88,st:'ok'},{id:'b3',name:'Manjunath S.',match:86,dist:'1.2 km',rel:91,st:'conflict',why:'Already on SH-4091 until 22:00'},{id:'b4',name:'Rahul D.',match:84,dist:'2.6 km',rel:72,st:'blocked',why:'Blocked by this client on 3 Sep'},{id:'b5',name:'Fatima K.',match:80,dist:'4.9 km',rel:95,st:'ok',why:'Ends after 22:00: women-safety cab will be booked'}];
export const REQS=[
{id:'REQ-2291',client:'Flipkart FC Hoskote',role:'Warehouse picker',tier:'Blue',line:'Shift',need:40,filled:31,sla:'At risk · 6 h',sev:'warn',owner:'Anita R.',kind:'blue'},
{id:'REQ-2287',client:'Infosys BPM',role:'Tele-caller (Kannada)',tier:'Grey',line:'Talent',need:15,filled:4,sla:'Breached 2 d',sev:'bad',owner:'Unassigned',kind:'blue'},
{id:'REQ-2280',client:'Razorpay',role:'Senior data scientist',tier:'Tech',line:'Pro',need:1,filled:0,sla:'On track',sev:'ok',owner:'Karthik M.',kind:'pro'},
{id:'REQ-2299',client:'Ambrosia Foods',role:'Line cook',tier:'Blue',line:'Shift',need:6,filled:0,sla:'Credit hold',sev:'bad',owner:'—',kind:'blocked'},
{id:'REQ-2276',client:'Prestige Group',role:'Housekeeping',tier:'Blue',line:'Talent',need:12,filled:12,sla:'Filled',sev:'ok',owner:'Anita R.',kind:'blue'}];
export const MATCH={blue:[
{id:'m1',name:'Ravi Kumar',match:92,reasons:'140 picker shifts · 3.2 km · reliability 94',st:'ok'},
{id:'m2',name:'Manjunath S.',match:88,reasons:'Loader, cross-trained picker · 1.2 km · reliability 91',st:'conflict',why:'Overlapping shift SH-4091 14:00–22:00. Cannot invite.'},
{id:'m3',name:'Imran Pasha',match:85,reasons:'62 shifts · 5.0 km · reliability 86',st:'docs',why:'Police verification expired 12 Oct. Invite allowed; deployment blocked until renewed.'},
{id:'m4',name:'Deepa R.',match:81,reasons:'30 warehouse shifts · 6.4 km · reliability 89',st:'ok'},
{id:'m5',name:'Venkatesh G.',match:78,reasons:'New worker · 2.0 km · skill test 8/10',st:'new',why:'No ratings yet. A first-shift buddy is assigned automatically.'},
{id:'m6',name:'Shabana K.',match:76,reasons:'48 shifts · 3.9 km · reliability 92',st:'ok'},
{id:'m7',name:'Prakash N.',match:74,reasons:'21 shifts · 7.1 km · reliability 84',st:'ok'},
{id:'m8',name:'Ganesh H.',match:72,reasons:'35 shifts · 4.4 km · reliability 80',st:'ok'},
{id:'m9',name:'Ramesh B.',match:70,reasons:'90 shifts · 8.0 km · reliability 79',st:'ok'},
{id:'m10',name:'Kavya M.',match:69,reasons:'12 shifts · 2.8 km · reliability 90',st:'ok'}],
pro:[{id:'p1',name:'Arjun Mehta',match:90,reasons:'5 yrs ML · Python assessment 92/100 · 30-day notice',st:'ok'},{id:'p2',name:'Sneha Iyer',match:86,reasons:'6 yrs NLP · AI interview scorecard 4.4/5',st:'docs',why:'Background check delayed 72 h at vendor. Shortlist allowed, offer blocked.'},{id:'p3',name:'Rohit S.',match:83,reasons:'7 yrs · ex-fintech',st:'new',why:'Expected CTC 40% above the client budget band.'}]};
export const CANDS=[
{id:'CW-10231',name:'Ravi Kumar',phone:'+91 98xxxx2210',tier:'Blue',mode:'Work Now',kyc:'Verified',sev:'ok',rel:'94',flag:'—'},
{id:'CW-10233',name:'Mohammed Irfan',phone:'+91 99xxxx0187',tier:'Blue',mode:'Work Now',kyc:'On hold',sev:'bad',rel:'—',flag:'Possible duplicate of CW-11870 (same face, different mobile)'},
{id:'CW-11502',name:'Lakshmi Devi',phone:'+91 90xxxx4451',tier:'Blue',mode:'Work Now',kyc:'In review',sev:'warn',rel:'97',flag:'Face match 62%, below threshold'},
{id:'CW-12011',name:'Arjun Mehta',phone:'+91 97xxxx9032',tier:'Tech',mode:'Career',kyc:'BGV pending',sev:'warn',rel:'—',flag:'—'},
{id:'CW-12090',name:'Priya Nair',phone:'+91 88xxxx3321',tier:'Campus',mode:'Career',kyc:'Verified',sev:'ok',rel:'—',flag:'Ambassador · Captain tier'},
{id:'CW-09876',name:'Rahul D.',phone:'+91 96xxxx7765',tier:'Blue',mode:'Work Now',kyc:'Verified',sev:'ok',rel:'72',flag:'Blocked by 1 client · reliability appeal open'},
{id:'CW-08810',name:'Sunita Rao',phone:'+91 94xxxx1200',tier:'White',mode:'Career',kyc:'Verified',sev:'ok',rel:'—',flag:'DPDP erasure request · due in 3 days'},
{id:'CW-13001',name:'Akash T.',phone:'+91 70xxxx5531',tier:'Blue',mode:'Work Now',kyc:'Blocked',sev:'bad',rel:'—',flag:'Under 18 (17 y 11 m). Activation scheduled 2 Nov'},
{id:'CW-07701',name:'Kiran B.',phone:'+91 81xxxx6610',tier:'Blue',mode:'Work Now',kyc:'Verified',sev:'ok',rel:'81',flag:'2 late arrivals this week'}];
export const KYC=[
{id:'KYC-881',name:'Lakshmi Devi',tier:'Blue',when:'2 h ago',role:'Housekeeping lead',issue:'Face mismatch',sev:'bad',checks:[['ok','Aadhaar e-KYC via DigiLocker','Verified · XXXX XXXX 4821'],['ok','Selfie liveness','Passed · score 0.97'],['fail','Face match to Aadhaar photo','62%. Threshold is 80%. Aadhaar photo is from 2012.'],['warn','Bank penny-drop','Name returned "LAKSHMI D". Partial match accepted under policy.'],['na','Police verification','Not required for this role']]},
{id:'KYC-882',name:'Arjun Mehta',tier:'Tech',when:'3 d ago',role:'Data scientist (Pro)',issue:'BGV delayed',sev:'warn',vendor:true,checks:[['ok','Aadhaar e-KYC','Verified · XXXX XXXX 0917'],['ok','PAN','Verified · name matches'],['warn','Background check (vendor)','No response for 72 h. SLA is 48 h.'],['warn','Employment check','Previous employer HR not responding after 2 reminders'],['ok','Skills assessment','Python 92/100 · SQL 88/100']]},
{id:'KYC-883',name:'Suresh M.',tier:'Blue',when:'5 h ago',role:'Kitchen steward',issue:'Fallback KYC',sev:'warn',checks:[['warn','Aadhaar e-KYC','DigiLocker unavailable. Offline Aadhaar XML uploaded, signature valid.'],['ok','Selfie liveness','Passed · 0.93'],['ok','Face match','88%'],['ok','UPI','suresh@okaxis verified']]},
{id:'KYC-884',name:'Akash T.',tier:'Blue',when:'1 d ago',role:'Helper',issue:'Under 18',sev:'bad',checks:[['ok','Aadhaar e-KYC','Verified · XXXX XXXX 5531'],['fail','Age','17 y 11 m. Minimum is 18. Turns 18 on 2 Nov 2026.'],['ok','Selfie liveness','Passed']]},
{id:'KYC-885',name:'Mohammed Irfan',tier:'Blue',when:'6 h ago',role:'Loader',issue:'Duplicate',sev:'bad',checks:[['ok','Aadhaar e-KYC','Verified · XXXX XXXX 7710'],['fail','Duplicate check','Face matches CW-11870 (registered with another mobile, 4 completed shifts)'],['ok','Bank','Verified']]}];
export const TS=[
{id:'t1',worker:'Ravi Kumar',client:'Toit Brewpub',date:'17 Oct',inout:'In 18:04 · Out 00:12',hours:'6.1 h',flag:'Clean · selfie and GPS matched',sev:'ok',status:'Client approved'},
{id:'t2',worker:'Lakshmi Devi',client:'Prestige Tech Park',date:'17 Oct',inout:'In 07:02 · Out 18:30',hours:'8 h + 3.5 h OT',flag:'Overtime above the 2 h/day cap needs client pre-approval',sev:'warn',status:'Pending client',kind:'ot'},
{id:'t3',worker:'Imran P.',client:'Flipkart FC',date:'18 Oct',inout:'In 09:01 · open',hours:'—',flag:'Check-in 340 m outside geofence',sev:'warn',status:'Under review',kind:'geo'},
{id:'t4',worker:'Deepa R.',client:'Taj MG Road',date:'16 Oct',inout:'In 17:00 · Out 23:05',hours:'6.1 h',flag:'Check-out selfie does not match. Possible proxy attendance.',sev:'bad',status:'Held',kind:'proxy'},
{id:'t5',worker:'Kiran B.',client:'Third Wave Coffee',date:'17 Oct',inout:'In 16:02 · Out 22:04',hours:'6.0 h (client says 4.0 h)',flag:'Client disputes hours',sev:'bad',status:'Disputed',kind:'dispute'},
{id:'t6',worker:'Manjunath S.',client:'Decathlon',date:'16 Oct',inout:'In 10:00 · no check-out',hours:'—',flag:'Phone switched off before check-out',sev:'warn',status:'Needs manual entry',kind:'missing'},
{id:'t7',worker:'Shabana K.',client:'Flipkart FC',date:'16 Oct',inout:'In 14:00 · Out 22:00',hours:'8.0 h',flag:'Client has not acted for 42 h. Auto-approves in 6 h.',sev:'info',status:'Pending client'}];
export const PAY=[
{id:'p1',name:'Ravi Kumar',kind:'Daily wage',to:'UPI ravi@ybl',amt:'₹1,240',status:'Ready',sev:'ok',note:'—'},
{id:'p2',name:'Lakshmi Devi',kind:'Daily wage',to:'Bank ****2210',amt:'₹980',status:'Failed',sev:'bad',note:'Invalid IFSC. Worker asked to update bank details.',act:'Send reminder'},
{id:'p3',name:'Suresh M.',kind:'Weekly',to:'Bank ****8812',amt:'₹5,450',status:'Failed',sev:'bad',note:'Account frozen by bank. UPI on file can be used instead.',act:'Switch to UPI'},
{id:'p4',name:'Deepa R.',kind:'Daily wage',to:'UPI deepa@okicici',amt:'₹860',status:'On hold',sev:'warn',note:'Fraud review: selfie mismatch. A person must clear or confirm.',act:'Review'},
{id:'p5',name:'Imran P.',kind:'Earned wage access',to:'UPI imran@paytm',amt:'₹2,000',status:'Above cap',sev:'warn',note:'Request is above 50% of earned wages (₹3,100). Max ₹1,550.',act:'Approve ₹1,550'},
{id:'p6',name:'Kiran B.',kind:'Daily wage',to:'UPI kiran@ybl',amt:'₹1,100',status:'Disputed',sev:'warn',note:'Linked to timesheet dispute. Paid hours follow the resolution.'},
{id:'p7',name:'Priya Nair',kind:'Ambassador commission',to:'UPI priya@oksbi',amt:'₹3,600',status:'Ready',sev:'ok',note:'TDS 10% (₹400) deducted'}];
export const FLAGS=[
{id:'f1',icon:'location_searching',type:'GPS spoofing',src:'Rule · mock-location app detected',entity:'Kiran B. · SH-4093',evidence:'Location jumped 4.1 km in 3 s. Developer mock location enabled on device.'},
{id:'f2',icon:'face_retouching_off',type:'Proxy attendance',src:'Rule · face match 41%',entity:'Deepa R. · SH-3977',evidence:'Check-out selfie matched another worker profile (CW-12230) at 78%.'},
{id:'f3',icon:'hub',type:'Referral ring',src:'Rule · shared device',entity:'Ambassador Rohan P. · 9 referrals',evidence:'9 sign-ups from 2 devices in 40 min. None completed a shift. ₹2,700 pending reward.'},
{id:'f4',icon:'currency_rupee',type:'Unusual payout',src:'Rule · 3 bank changes in 7 days',entity:'Worker CW-11214',evidence:'Bank account changed 3 times this week; latest name does not match KYC.'}];
export const TIX=[
{id:'GR-0091',icon:'shield_person',ic:'#B3261E',subject:'Anonymous: harassment report, night shift',from:'Worker app · identity hidden · visible to Grievance Officer only',sla:'Response due in 1 h 10 m',sfg:'#B3261E',status:'Priority',sev:'bad',act:'Assign officer'},
{id:'TK-4410',icon:'money_off',ic:'#B3261E',subject:'Unpaid wages for 14 Oct shift',from:'Lakshmi Devi · worker',sla:'SLA breached 3 h ago',sfg:'#B3261E',status:'Escalated',sev:'bad',act:'Open'},
{id:'TK-4415',icon:'report',ic:'#F9AB00',subject:'Agent at site asked for ₹500 fee',from:'Ravi Kumar · zero-fee violation',sla:'Due in 5 h',sfg:'#7A5900',status:'Investigating',sev:'warn',act:'Open'},
{id:'TK-4402',icon:'storefront',ic:'#0B57D0',subject:'Replacement for no-show was late',from:'Decathlon · client',sla:'Due in 22 h',sfg:'#444746',status:'Open',sev:'info',act:'Open'},
{id:'TK-4398',icon:'privacy_tip',ic:'#0B57D0',subject:'Request to delete my data (DPDP)',from:'Sunita Rao · data principal',sla:'Statutory deadline in 3 days',sfg:'#7A5900',status:'In progress',sev:'warn',act:'Open'}];
export const AUDIT=[{t:'16:12',who:'Shift Autopilot',action:'Booked backup Arun T. for no-show',entity:'SH-4064'},{t:'15:58',who:'Fraud rules',action:'Held payout pending review',entity:'Deepa R.'},{t:'15:40',who:'Meera K. (Finance)',action:'Issued credit note ₹1,800',entity:'CN-26-0112'},{t:'14:05',who:'Karthik M. (Recruiter)',action:'Moved Arjun Mehta to Interviewing',entity:'REQ-2280'}];
export const AMBS=[
{id:'a1',name:'Priya Nair',college:'Christ University',tier:'Captain',stats:'38 workers · 4 clients',due:'₹3,600',note:'All rewards on completed shifts',sev:'ok',act:'Approve'},
{id:'a2',name:'Aditya S.',college:'RV College',tier:'Explorer',stats:'22 workers · 1 client',due:'₹1,950',note:'Hit Captain target. Promote?',sev:'info',act:'Promote'},
{id:'a3',name:'Rohan P.',college:'Jain University',tier:'Explorer',stats:'9 sign-ups · 0 shifts',due:'₹2,700',note:'Referral ring flagged. Rewards clawed back if confirmed.',sev:'bad',act:'Claw back'},
{id:'a4',name:'Fathima Z.',college:'Mount Carmel',tier:'City Lead',stats:'6 captains · 140 workers',due:'₹12,000',note:'Stipend + revenue share. Queued for November (budget cap).',sev:'warn',act:'Approve'}];
