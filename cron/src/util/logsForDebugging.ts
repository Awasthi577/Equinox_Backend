let totalWebsiteNewsAddedInDb = 0;
let totalYoutubeNewsAddedInDb = 0;
let totalTwitterNewsAddedInDb = 0;

export const WebsiteNewsAddedInDB = () => {
    totalWebsiteNewsAddedInDb++;
}
export const YoutubeNewsAddedInDB = () => {
    totalYoutubeNewsAddedInDb++;
}
export const TwitterNewsAddedInDB = () => {
    totalTwitterNewsAddedInDb++;
}

export const finalLog = () => {
    console.log(`\n\n[+] Total Website News Added in DB: ${totalWebsiteNewsAddedInDb}`);
    console.log(`[+] Total Youtube News Added in DB: ${totalYoutubeNewsAddedInDb}`);
    console.log(`[+] Total Twitter News Added in DB: ${totalTwitterNewsAddedInDb}`);
    console.log(`\n[+] Total News Added in DB: ${totalWebsiteNewsAddedInDb + totalYoutubeNewsAddedInDb + totalTwitterNewsAddedInDb}`);
}