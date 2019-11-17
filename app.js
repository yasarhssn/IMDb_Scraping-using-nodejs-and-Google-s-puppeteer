const puppeteer = require('puppeteer');
const fs = require('fs');

console.log('working');

var ram={
    name : "ramkumar",
    age : 15
};
ram = JSON.stringify(ram);
fs.writeFile('samplefile.json',ram,(err,result)=>
{
    if(err)console.log(err);
    else console.log('working fine');
});
(async function main()
{
    try{
            const browser = await puppeteer.launch({headless:false});

            const page = await browser.newPage();

            await page.goto('https://www.imdb.com/chart/top?ref_=nv_mv_250',{waitUntil:"networkidle2",timeout:300000});
            //await page.waitFor(3000);
            console.log('TRK');
               await page.waitForSelector('.lister-list tr');
                console.log('ramkumar');
            let movies= await page.$$('.lister-list tr');
            console.log('length:' + movies.length);

            let director,writers,stars;
            var jsonObject = [];

        //page.$$ - for counting
        //$for waitForSelector

        for(var i=0;i<movies.length;i++)        
        {
            let movie = movies[i];
                const buttonref = await movie.$('a');
                buttonref.click();

                 await page.waitForSelector('div.title_wrapper h1');
                 page.waitForNavigation();
                var title = await page.$eval('div.title_wrapper h1',h1=>h1.innerText);
                 console.log('Title:' + title);

                 await page.waitForSelector('div.subtext');
                 page.waitForNavigation();
                 
                 var releaseDate = await page.$eval('div.subtext',a=>a.innerText);

                 console.log('Release Date:' + releaseDate);

                 await page.waitForSelector('div.ratingValue');
                 page.waitForNavigation();
                 var ratingValue = await page.$eval('div.ratingValue span', rating =>rating.innerText);
                 console.log('Rating value:' + ratingValue);

                 await page.waitForSelector('div.poster a img');
                 page.waitForNavigation();
                 var imageUrl = await page.$eval('div.poster a img',img=>img.getAttribute('src'));
                 console.log('Image Url:' + imageUrl);

                 const summary_items = await page.$$('div.credit_summary_item');
                 console.log('summary_item_length:' + summary_items.length);
                 

                 for(var j=0;j<summary_items.length;j++)
                 {
                    const summary_item = summary_items[j];
                 

                    if(j==0)
                    {
                 director = await summary_item.$eval('a' ,a=>a.innerText); 
                 
                 console.log('director:' + director);
                    }

                 if(j==1)
                 {
                    writers = await summary_item.$eval('a' ,a=>a.innerText); 
                 console.log('writers:' + writers);
                 }
                 else
                 {
                    stars = await summary_item.$eval('a' ,a=>a.innerText); 
                 console.log('stars:' + stars);
                 }

                 }
                 var moviesIMDB=
                 {
                     Title : title,
                     ReleaseDate : releaseDate,
                     RatingValue : ratingValue,
                     MovieImage : imageUrl,
                     Director :director,
                     Writer : writers,
                     Star : stars

                 };

                
            

                
                jsonObject.push(moviesIMDB);
                
                 await page.goBack();
                 await page.waitFor(3000);
                 movies= await page.$$('.lister-list tr');
                 
        }
          
        
        let json  = JSON.stringify(jsonObject);
        fs.writeFile('imdbmovies.json',json,(err,result)=>
        {
            if(err)console.log(err);
            else console.log('working fine');
        });
        
     //jsonObject       ;
await browser.close();
            
    }//try
    catch(error)
    {
        console.log('Error in web scraping:' + error);
        
        
    }
})();