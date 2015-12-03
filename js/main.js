var main = (function(){
    var count= 1,
        flagCount = 0,
        marginLeft = 0;
    var init = function () {
        _setUpListners();
    };
    var _setUpListners = function() {
        $('.map').on('mouseout', _changeBG);
        $('.map').on('mouseover', _changeBG);
        $('.map').on('click', _handler);
    };
    var _handler =function () {
        var $target;
        if (event.target.classList.contains('map')) {
            $target= event.target;
        }else{
            $target= event.target.closest('.map');
        }
        if (event.shiftKey) {
            _addMap();
        } else {
            _removeMap($target);
        }
    };
    var _addMap = function () {
        var parent = document.getElementById('map__wrapper'),
            div = document.createElement('div'),
            p = document.createElement('p'),
            divInn = document.createElement('div'),
            doc_w = document.documentElement.clientWidth,
            width = 960;

        marginLeft = marginLeft+60;
        console.log('mar+60=' +marginLeft);


        divInn.className = "map__number_content";
        count=count+1;
        p.className = "map__number";
        p.innerText = count;
        divInn.appendChild(p);
        if (event.altKey) {

            //console.log(doc_w-560<marginLeft);
            //if (doc_w<marginLeft) {
            //    flarLast = true;
            //    marginLeft = doc_w-60+'px';
            //}else{
            //    marginLeft = marginLeft+'px';
            //}

            if (marginLeft+960 > doc_w) {
                console.log('to much');
                width = doc_w - marginLeft;
                //width = doc_w - marginLeft-200;
                if (width<400) {width=400;
                    marginLeft=marginLeft-60;
                    console.log('mar-60=' +marginLeft);
                    flagCount=flagCount+1;
                    console.log('flagCount=' +flagCount);

                };
                console.log('width ' +width );
            }
            div.className = "map wide active";
            //console.log(div.style.width);



        }else {
            console.log(doc_w-400<marginLeft);
            if (doc_w-400<marginLeft) {
                marginLeft = marginLeft-60;
                console.log('mar-60=' +marginLeft);
                flagCount=flagCount+1;
                console.log('flagCount=' +flagCount);
            }else{
                //marginLeft = marginLeft+'px';
            }
            div.className = "map narrow active";
        }
        div.setAttribute('onclick','main.clickMap(this)');
        div.setAttribute('onmouseout','main.mouseEvent()');
        div.setAttribute('onmouseover','main.mouseEvent()');
        console.log(marginLeft);
        div.style.marginLeft=marginLeft+'px';
        div.appendChild(divInn);
        parent.appendChild(div);
        if (div.classList.contains('wide')) {
            div.style.width=width + 'px';
        }
        div.previousElementSibling.classList.remove('active');
        div.previousElementSibling.style.width = 400+'px';
    };
    var _removeMap = function($target) {
        if ($target.classList.contains('active')) {
            if (count == 1) {
                alert('Нельзя удаить все карточки!');
                return;
            }
            $target.previousElementSibling.classList.add('active');
            count = count - 1;
            if ((flagCount >0) ) {
                flagCount= flagCount-1 ;
                console.log('mar=' +marginLeft);
                console.log('flagCount=' +flagCount);
            }else {
                marginLeft = marginLeft-60;
                console.log('mar-60=' +marginLeft);
                console.log('flagCount=' +flagCount);
            }

            $target.parentNode.removeChild($target);



            //
            //if (count==1) {
            //    marginLeft = marginLeft+60;
            //    console.log(' count=1 mar+60=' +marginLeft);
            //
            //}
        }else {
            alert('Карточка не активна! Можно удалить только последнюю открытую карточку');
            return;
        }
    }
    var _changeBG = function () {
        switch(event.type) {
            case 'mouseover' :
                $('body').css('background', '#f6f2de');
                break;
            case 'mouseout' :
                $('body').css('background', '#e9e6d3');
                break;
        }
    };
    return {
        init: init,
        clickMap : _handler,
        mouseEvent: _changeBG,
    };

})();

main.init();