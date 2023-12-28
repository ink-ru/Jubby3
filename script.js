// https://codepen.io/ink-jet/pen/dyrovGN

/*
╔════════════════════════════════════════════════════════════╗
║                 Wait for Element appear                    ║
╚════════════════════════════════════════════════════════════╝
*/ // https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function text_placeholder(selector)
{
	var txt = 'Такая потеря собственной сущности превращает конформизацию в императив: человек может быть уверен в себе лишь в том случае, если живет в соответствии с ожиданиями других. Если мы живем не по общепринятому сценарию, то рискуем не только вызвать неодобрение и возросшую изоляцию, но и потерять уверенность в своей сущности, что угрожает психическому здоровью.';

	return $(selector).replaceWith(txt);
}

// https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
var isOutOfViewport = function (elem)
{

    if (typeof jQuery === "function" && elem instanceof jQuery) elem = elem[0];

	// Get element's bounding
	var bounding = elem.getBoundingClientRect();

	// Check if it's out of the viewport on each side
	var out = {};

	out.top = bounding.top < 0-(bounding.height+10);
	out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight)+(bounding.height-10);

	out.left = bounding.left < 0;
	out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
	//
	out.any = out.top || out.left || out.bottom || out.right;
	out.all = out.top && out.left && out.bottom && out.right;

	return out;

};

function revers_list(list)
{
	var rev_arr = [];
	var checkList_reversed = {};

	if(typeof list === 'object' && !Array.isArray(list) && list !== null)
	{
		const reversedKeys = Object.keys(list).reverse();

		reversedKeys.forEach((key, index) => { checkList_reversed[key] = list[key] });

		return checkList_reversed;
	}
	else if(Array.isArray(list) && list !== null)
	{

		Object.keys(list).reverse().forEach(value => {
		  rev_arr[value] = list[value];
		})

		return rev_arr;
	}
	else return false;

}

function load_css()
{
	const style_obj = document.querySelector("#import_css");
	const compStyle = window.getComputedStyle(style_obj);

	if(compStyle.getPropertyValue('visibility')!='hidden')
	{
		$( "#import_css" ).load( "https://raw.githubusercontent.com/ink-ru/Jubby3/main/style.css" );
		console.info('No default styles was found, global was loaded!');
	}

	return true;
}

function checkViewport()
{
	var checkList = [];
	var checkList_reversed = [];
	var count = 0;
	var stop = false;

	// определяем направление скрола (возможно не на каждый пиксель, задержку сделать)
	const direction = (this.oldScroll > this.scrollY);
	this.oldScroll = this.scrollY;

	let bItems = document.querySelectorAll(".flex-item");

	// работаем только если количество елементов более 4 (хорошо бы размер на экране проверять еще)
	if(4 > bItems.length) return false;

	// формируем бинарный массив флагов видимости (да, нет)
	bItems.forEach((curItem) => {
		checkList[curItem.id] = (isOutOfViewport(curItem).top || isOutOfViewport(curItem).bottom);
	});

	/* TODO: Не понятно нужна ли сортировка. Пока все сохраняется в линойном порядке. */


	/*Revers относительно направления скролла*/
	if(direction) checkList = revers_list(checkList);

	console.table(checkList);
	console.log("---------------");

	if( (Object.keys(checkList).length - Object.values(checkList).filter(Boolean).length) < 2 ) return true;

	/*считаем невидимыt элементы с начала */
	// if(typeof checkList === 'object' && checkList !== null)
	{
		for (let [key, value] of Object.entries(checkList))
		{
		    if(value === true && stop === false) count++;
		    	else stop = true;
		}
	}
	// else if(Array.isArray(checkList) && checkList !== null)
	// {
	// 	for (const list_item of checkList)
	// 	{
	// 	    if(list_item === true && stop === false) count++;
	// 	    	else stop = true;
	// 	}
	// }


	/*если болле 25% и более 2, вызываем функцию перемещения*/
	if(count > 3)
	{
		// console.info(Object.keys(checkList)[0]);

		let target = $('#'+Object.keys(checkList)[0]);

		if(direction) target.prependTo(target.parent()); // up 
			else target.appendTo(target.parent()); // down
	}



}

// Вместо document ready
$(function()
{
	window.addEventListener('scroll', checkViewport, false);
	text_placeholder('.item-descr');

	setTimeout(() => {
		waitForElm('footer#footer').then((elm) => {
			load_css();
		});
	}, "1000");

	

});
