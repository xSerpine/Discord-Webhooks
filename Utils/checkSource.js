import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { urls } from '../server.js';
import { checkOpencritic } from './checkOpencritic.js';

export const checkSource = async(url, option) => {
	try {
		const res = await fetch(url);
		const data = res.headers.get('Content-Type')?.includes('application/json') ? await res.json() : await res.text();
		if(!res.ok) return console.log(`${res.status} - ${data}`);

		switch (option) {
			case 'News': {
				urls.push(data.data.children[0].data.url);
				break;
			}
			case 'Reviews': {
				const { opencritic_url } = await checkOpencritic();
				urls.push(opencritic_url);
				break;
			}
			case 'Deals': {
				urls.push(data.data.children[0].data.url);
				break;
			}
			case 'FreeGames': {
				urls.push(data.data.children[0].data.url);
				break;
			}
			case 'Xbox': {
				const $ = cheerio.load(data);
				urls.push($('.archive-main .media .media-body .feed__title a').first().attr('href'));
				break;
			}
			case 'Playstation': {
				urls.push(data.data.children[0].data.url);
				break;
			}
			case 'Nintendo': {
				urls.push(data.data.children[0].data.url);
				break;
			}
			case 'Anime': {
				urls.push(data.data.children[0].data.url);
				break;
			}
			case 'Manga': {
				urls.push(data.data.children[0].data.url);
				break;
			}
			case 'Memes': {
				const sortedMemes = data.data.children.sort((a, b) => b.data.created_utc - a.data.created_utc);

				const index = sortedMemes.findIndex(item => !item.data.stickied && !item.data.is_video && !item.data.removed_by_category);
				if(index === -1) return;

				const url = sortedMemes[index].data.url;

				urls.push(url);
				break;
			}
			default:
				break;
		}
	} catch (error) {
		console.log(error);
	}
}