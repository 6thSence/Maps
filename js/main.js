var main = (function(){
    var count= 0,// подсчет карточек, изначально всегда одна карточка
        flagCount = 0,// колличество повторяющихся карточек, если закончилось место(ширина) на экране
        width = 960, // стандартная ширина большой карточки
        doc_w = document.documentElement.clientWidth,//ширина экрана, понадобится для того чтобы определить хватает ли места для следующей карточки
        marginLeft = 0, // Переменная хранящее в себе следующее расположение карточки, через margin-left
        firstReload =  true;


    //Функции инициализации модуля
    var init = function () {
        _setUpListners();
    };

    //Прослушка событий мыши и кликов
    var _setUpListners = function() {
        $('.map').on('mouseout', _changeBG);
        $('.map').on('mouseover', _changeBG);
        $('.map').on('click', _handler);
        _creatCards(cards);

        $(window).bind('popstate', function() {
            cards = JSON.parse(window.history.state);
            $('#map__wrapper').empty();
            count=0;
            marginLeft = 0;
            flagCount= 0;
            firstReload=false;
            _creatCards(cards);
        });
    };

    //Функция считывание карточек из массива и их создания
    var _creatCards = function (cards) {
        //На случай если массив пустой, создадим все-таки одну карточку
        if (cards.length === 0 ) {
             cards[0]=
                    {
                        type: 'narrow'
                    };
        };
        // Пройдемся по всем еллементам массива
        cards.forEach(function(item, i, cards) {
            var parent = document.getElementById('map__wrapper'), // родитель карточек
                div = document.createElement('div'), //сама будущая карточка
                p = document.createElement('p'), // номер карточки
                divInn = document.createElement('div'); //обертка номера карточки
            doc_w = document.documentElement.clientWidth; //обновить значение на случай рисайза окна
            if (count>0) {
                marginLeft = marginLeft + 60;
            }
            divInn.className = "map__number_content";
            count=count+1;
            p.className = "map__number";
            p.innerText = count;
            divInn.appendChild(p);
            //Проверяем был ли нажал alt, чтобы понять какую карточку добавлять
            switch(item.type) {
                case 'narrow' :
                    //Проверяем вписываются ли наши маленькие карточки в экран (аналогично)
                    if (doc_w - 400 < marginLeft) {
                        marginLeft = marginLeft - 60;
                        flagCount = flagCount + 1;
                    }
                    div.className = "map narrow active";
                    break;
                case 'wide':
                        //Проверяем вписывается ли большая карточка в оставшееся место на экране
                        if (marginLeft + 960 > doc_w) {
                            width = doc_w - marginLeft; //Задаем подходящую ширину
                            //Если осталось меньше 400 px то остаемся на этом значении и накручиваем flagCount, чтобы знать сколько там лежит карточек
                            if (width < 400) {
                                width = 400;
                                marginLeft = marginLeft - 60;
                                flagCount = flagCount + 1;
                            };
                        };
                        div.className = "map wide active"; // навешиваем класс map -карты, wide - большой карты, и active - активной(основной) карты
                    break;
            };
            //Добавляем нашему новому еллементу необходимые события
            div.setAttribute('onclick','main.clickMap(this)');
            div.setAttribute('onmouseout','main.mouseEvent()');
            div.setAttribute('onmouseover','main.mouseEvent()');
            //Добавляем отступ рассчитаный выше
            div.style.marginLeft=marginLeft+'px';
            div.appendChild(divInn); //Добавляем в дом
            parent.appendChild(div);
            if (div.classList.contains('wide')) {
                div.style.width=width + 'px'; //Корректируем ширину
            }
            if (count>1) {
                div.previousElementSibling.classList.remove('active');
                div.previousElementSibling.style.width = 400+'px'; //Всем неактивным картам задаем ширину 400 px
            }
            width=960;
        });
        if (firstReload) {
        history.pushState(JSON.stringify(cards), null, null);
        };

    };
    //Фунция для работы с кликом по карточке. Определяет еллемент события и назначает целевым еллементов всю карту.
    var _handler =function () {
        var $target;
        if (event.target.classList.contains('map')) {
            $target= event.target;
        }else{
            $target= event.target.closest('.map');
        }
        //Проверяет был ли нажат шифт и в зависиммости от этого вызывает фунцию "удаления карточки" или "добавление карточки"
        if (event.shiftKey) {
            _addMap();
        } else {
            _removeMap($target);
        }
    };
    // Функция добавления карточки
    // Создает карточку и добавляет её в DOM
    var _addMap = function () {
        var parent = document.getElementById('map__wrapper'), // родитель карточек
            div = document.createElement('div'), //сама будущая карточка
            p = document.createElement('p'), // номер карточки
            divInn = document.createElement('div'); //обертка номера карточки

        doc_w = document.documentElement.clientWidth; //обновить значение на случай рисайза окна
        marginLeft = marginLeft+60;
        divInn.className = "map__number_content";
        count=count+1;
        p.className = "map__number";
        p.innerText = count;
        divInn.appendChild(p);
        //Проверяем был ли нажал alt, чтобы понять какую карточку добавлять
        if (event.altKey) {
            //Проверяем вписывается ли большая карточка в оставшееся место на экране
        if (marginLeft+960 > doc_w) {
            width = doc_w - marginLeft; //Задаем подходящую ширину
            //Если осталось меньше 400 px то остаемся на этом значении и накручиваем flagCount, чтобы знать сколько там лежит карточек
            if (width<400) {width=400;
                marginLeft=marginLeft-60;
                flagCount=flagCount+1;
            };
        }
        div.className = "map wide active"; // навешиваем класс map -карты, wide - большой карты, и active - активной(основной) карты
            cards[cards.length] ={
                type: 'wide'
            };
        }else {
            cards[cards.length] ={
                type: 'narrow'
            };
            //Проверяем вписываются ли наши маленькие карточки в экран (аналогично)
        if (doc_w-400<marginLeft) {
            marginLeft = marginLeft-60;
            flagCount=flagCount+1;
        }
        div.className = "map narrow active";
        }
        //Добавляем нашему новому еллементу необходимые события
        div.setAttribute('onclick','main.clickMap(this)');
        div.setAttribute('onmouseout','main.mouseEvent()');
        div.setAttribute('onmouseover','main.mouseEvent()');
        //Добавляем отступ рассчитаный выше
        div.style.marginLeft=marginLeft+'px';
        div.appendChild(divInn); //Добавляем в дом
        parent.appendChild(div);
        if (div.classList.contains('wide')) {
            div.style.width=width + 'px'; //Корректируем ширину
        }
        div.previousElementSibling.classList.remove('active');
        div.previousElementSibling.style.width = 400+'px'; //Всем неактивным картам задаем ширину 400 px
        width=960;
        history.pushState(JSON.stringify(cards), null, null);
    };

    //Функция удаления карточек
    var _removeMap = function($target) {

        //Удаляем только с активной карточки
        if ($target.classList.contains('active')) {
            //И обязательно оставляем хотя бы одну карточку на экране
            if (count == 1) {
                alert('Давайте не будем удалять все карточки! :)');
                return;
            }
            //до удаления передаем класс active предыдущей карточке
            $target.previousElementSibling.classList.add('active');
            if ($target.previousElementSibling.classList.contains('wide')) {
                //Проверяем вписывается ли большая карточка в оставшееся место на экране
                if (marginLeft+960 > doc_w) {
                    width = doc_w - marginLeft; //Задаем подходящую ширину
                    //Если осталось меньше 400 px то остаемся на этом значении и накручиваем flagCount, чтобы знать сколько там лежит карточек
                    if (width<400) {width=400;
                        marginLeft=marginLeft-60;
                        flagCount=flagCount+1;
                    };
                }
                $target.previousElementSibling.style.width=width + 'px'; //Корректируем ширину

            }
            count = count - 1;
            // Если flagCount (лежащие друг на друге карточки) накручен , то учитываем это при рассчете следующего расположения карточки
            if ((flagCount >0) ) {
                flagCount= flagCount-1 ;
            }else {
                marginLeft = marginLeft-60;
            }
            cards.pop();
            $target.parentNode.removeChild($target); // Удаляем карточку
        }else {
            alert('Карточка неактивна! :( Можно удалить только последнюю открытую карточку.');
            return;
        }
        history.pushState(JSON.stringify(cards), null, '?delete');
    }

    //Функция подсвечивания фона другим цветом
    var _changeBG = function () {
        // Делегирование
        switch(event.type) {
            case 'mouseover' :
                $('body').css('background', '#f6f2de');
                break;
            case 'mouseout' :
                $('body').css('background', '#e9e6d3');
                break;
        }
    };
    //Публичные функции clickMap & mouseEvent для использования из разметки
    return {
        init: init,
        clickMap : _handler,
        mouseEvent: _changeBG,
    };
})();
if ($('.map')) {
    main.init();
}



