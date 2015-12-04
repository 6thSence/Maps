"use strict";
var main = ( function() {
    var count = 0,
        flagCount = 0,
        width = 960,
        doc_w = document.documentElement.clientWidth,
        marginLeft = 0,
        firstReload = true;
    var init = function () {
        _setUpListners();
    };
    var _setUpListners = function () {
        $('.map').on('mouseout', _changeBG);
        $('.map').on('mouseover', _changeBG);
        $('.map').on('click', _handler);
        _creatCards(cards);
        $(window).bind('popstate', function() {
            cards = JSON.parse(window.history.state);
            $('#map__wrapper').empty();
            count = 0;
            marginLeft = 0;
            flagCount = 0;
            firstReload = false;
            if (cards) {
                _creatCards(cards);
            }
        });
    };
    var _creatCards = function (cards) {
        if (cards.length === 0) {
             cards[0] =
                    {
                        type : 'narrow'
                    };
        }
        cards.forEach(function (item) {
            var parent = document.getElementById('map__wrapper'),
                div = document.createElement('div'),
                p = document.createElement('p'),
                divInn = document.createElement('div');
            doc_w = document.documentElement.clientWidth;
            if (count > 0) {
                marginLeft = marginLeft + 60;
            }
            divInn.className = "map__number_content";
            count = count + 1;
            p.className = "map__number";
            p.innerText = count;
            divInn.appendChild(p);
            switch (item.type) {
                case 'narrow' :
                    if (doc_w - 400 < marginLeft) {
                        marginLeft = marginLeft - 60;
                        flagCount = flagCount + 1;
                    }
                    div.className = "map narrow active";
                    break;
                case 'wide':
                        if (marginLeft + 960 > doc_w) {
                            width = doc_w - marginLeft;
                            if (width < 400) {
                                width = 400;
                                marginLeft = marginLeft - 60;
                                flagCount = flagCount + 1;
                            }
                        }
                        div.className = "map wide active";
                    break;
            }
            div.setAttribute('onclick', 'main.clickMap(this)');
            div.setAttribute('onmouseout', 'main.mouseEvent()');
            div.setAttribute('onmouseover', 'main.mouseEvent()');
            div.style.marginLeft = marginLeft + 'px';
            div.appendChild(divInn);
            parent.appendChild(div);
            if (div.classList.contains('wide')) {
                div.style.width = width + 'px';
            }
            if (count > 1) {
                div.previousElementSibling.classList.remove('active');
                div.previousElementSibling.style.width = 400 + 'px';
            }
            width = 960;
        });
        if (firstReload) {
        history.pushState(JSON.stringify(cards), null, null);
        }
    };
    var _handler =function () {
        var $target;
        if (event.target.classList.contains('map')) {
            $target = event.target;
        } else {
            $target = event.target.closest('.map');
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
            divInn = document.createElement('div');
        doc_w = document.documentElement.clientWidth;
        marginLeft = marginLeft + 60;
        divInn.className = "map__number_content";
        count = count + 1;
        p.className = "map__number";
        p.innerText = count;
        divInn.appendChild(p);
        if (event.altKey) {
        if (marginLeft + 960 > doc_w) {
            width = doc_w - marginLeft;
            if (width < 400) {
                width =400;
                marginLeft = marginLeft-60;
                flagCount = flagCount + 1;
            }
        }
        div.className = "map wide active";
            cards[cards.length] ={
                type: 'wide'
            };
        }else {
            cards[cards.length] ={
                type: 'narrow'
            };
        if (doc_w - 400 < marginLeft) {
            marginLeft = marginLeft - 60;
            flagCount = flagCount + 1;
        }
        div.className = "map narrow active";
        }
        div.setAttribute('onclick','main.clickMap(this)');
        div.setAttribute('onmouseout','main.mouseEvent()');
        div.setAttribute('onmouseover','main.mouseEvent()');
        div.style.marginLeft=marginLeft+'px';
        div.appendChild(divInn);
        parent.appendChild(div);
        if (div.classList.contains('wide')) {
            div.style.width = width + 'px';
        }
        div.previousElementSibling.classList.remove('active');
        div.previousElementSibling.style.width = 400+'px';
        width = 960;
        history.pushState(JSON.stringify(cards), null, null);
    };
    var _removeMap = function($target) {
        if ($target.classList.contains('active')) {
            if (count == 1) {
                alert('Давайте не будем удалять все карточки! :)');
                return;
            }
            $target.previousElementSibling.classList.add('active');
            if ($target.previousElementSibling.classList.contains('wide')) {
                if (marginLeft + 960 > doc_w) {
                    width = doc_w - marginLeft;
                    if (width < 400) {
                        width = 400;
                        marginLeft = marginLeft - 60;
                        flagCount = flagCount + 1;
                    }
                }
                $target.previousElementSibling.style.width = width + 'px';
            }
            count = count - 1;
            if (flagCount > 0) {
                flagCount = flagCount - 1 ;
            }else {
                marginLeft = marginLeft - 60;
            }
            cards.pop();
            $target.parentNode.removeChild($target);
        }else {
            alert('Карточка неактивна! :( Можно удалить только последнюю открытую карточку.');
            return;
        }
        history.pushState(JSON.stringify(cards), null, ' 1 ');
    };
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
        mouseEvent: _changeBG
    };
})();
if ($('.map__wrapper')) {
    main.init();
}



