export const categories=['All','LP Apparel','Padel Essentials','Rackets & Bags','Partner Offers'];
// Add approved affiliate offers only: {id,title,description,url,partner}.
// Use the exact issued tracking URL. Never substitute a retailer homepage.
export const partnerOffers=[];
// Each size/colour is a separate catalogue SKU, with its own price and capacity.
// Optional metadata keyed by SKU slug: {category,group,option,sizeGuide,deadline}.
export const productInfo={};
export function categoryFor(p){
 if(productInfo[p.slug]?.category)return productInfo[p.slug].category;
 const name=p.title.toLowerCase();
 if(/shirt|hoodie|vest|cap|apparel|sock|short|skirt/.test(name))return 'LP Apparel';
 if(/racket|racquet|bag/.test(name)&&!/protector|grip/.test(name))return 'Rackets & Bags';
 return 'Padel Essentials';
}
export function groupsFor(products){
 const groups=new Map();
 for(const p of products){const meta=productInfo[p.slug]||{};const key=meta.group||p.id;
 if(!groups.has(key))groups.set(key,{id:key,title:meta.group||p.title,category:categoryFor(p),variants:[]});
 groups.get(key).variants.push({...p,meta});}
 return [...groups.values()];
}
export const plannedRange=[
 ['LP match shirt','LP Apparel','Register interest in LP performance shirts. Sizes, sample, price and production dates to be confirmed.'],
 ['Franchise team shirt','LP Apparel','Ask about a team order with your franchise colours and player names.'],
 ['LP cap & towel','LP Apparel','Register interest in LP accessories for match days and supporters.'],
 ['Overgrip pack','Padel Essentials','Ask about grip options and pack quantities.'],
 ['Racket protector','Padel Essentials','Ask about compatible protectors for your racket.'],
 ['Padel balls','Padel Essentials','Ask about tubes and team quantities.'],
 ['Daisy Cup player pack','Padel Essentials','Register interest in a match-day pack. Contents and pricing are not confirmed.'],
 ['Rackets & bags','Rackets & Bags','Tell us your budget and playing needs. We will confirm available supplier options.'],
];
export const enquiryLink=title=>'mailto:admin@lowveldpadel.co.za?'+new URLSearchParams({subject:'LP Shop enquiry — '+title,body:'Hi LP,\nI am interested in: '+title+'\nQuantity:\nPreferred size / colour (if applicable):\nMobile number:\n\nPlease confirm price, availability and collection timing.'}).toString();
export function safePartner(url){try{return new URL(url).protocol==='https:';}catch{return false;}}
