var main = (function(){
    var count=1;
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
            marginLeft = count*60,
            doc_w = $(document).width()-400;
        console.log(doc_w<marginLeft);
        if (doc_w<marginLeft) {
            marginLeft = doc_w-60+'px';
        }else{
            marginLeft = marginLeft+'px';
        }
        divInn.className = "map__number_content";
        count=count+1;
        console.log(count);
        p.className = "map__number";
        p.innerText = count;
        divInn.appendChild(p);
        if (event.altKey) {
            div.className = "map wide active";
            div.setAttribute('onclick','main.clickMap(this)');
        }else {
            div.className = "map narrow active";
            div.setAttribute('onclick','main.clickMap(this)');
        }
        console.log(marginLeft);
        div.style.marginLeft=marginLeft;
        div.appendChild(divInn);
        parent.appendChild(div);
        div.previousElementSibling.classList.remove('active');

    };
    var _removeMap = function($target) {
        if ($target.classList.contains('active')) {
            if (count == 1) {
                alert('Нельзя удаить все карточки!');
                return;
            }
            $target.previousElementSibling.classList.add('active');
            $target.parentNode.removeChild($target);
            count = count - 1;
            console.log(count);
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
    };

})();

main.init();