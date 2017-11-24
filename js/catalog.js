/*
 * @Author: fuwei
 * @Date:   2017-09-08 13:14:47
 * @Last Modified by:   fuwei
 * @Last Modified time: 2017-09-12 20:35:10
 */
var catalog = function($) {
    var _config = {
        dom: $("article"),
        splitChar: "."
    }
    var pos = {};
    var initPos = {};
    var _init = function(config) {
        if (!!config) {
            $.extend(true, _config, config);
        }
        var catjson = _initCatalog();
        catjson = _initCatalogIndex(catjson);
        var divDom = _initDom(catjson);
        $("body").append(divDom);
        _bindMove(divDom);
        console.log(catalog);
    }

    var _initCatalog = function() {
        var hList = _config.dom.find('h1,h2,h3,h4,h5');
        if (hList.length === 0) return;
        var catJson = [];
        $.each(hList, function(index, value) {
            var obj = {};
            obj.text = $(value).text();
            obj.level = parseInt($(value)[0].tagName.replace("H", ""));
            obj.achorName = _excludeSpecial(obj.text)
            obj.order = index + 1;
            catJson.push(obj);
        });
        console.log(catJson);
        return catJson;
    }

    var _initCatalogIndex = function(obj) {
        var len = obj.length;
        for (var i = 0; i < len; i++) {
            obj[i].chapterIndex = _getNodeChapterIndex(obj, i);
        }
        return obj;
    }

    var _getNodeByLevel = function(obj, level, index) {
        for (var i = index - 1; i >= 0; i--) {
            if (obj[i].level === level) {
                return obj[i];
            }
        }
        return null;
    }
    var _getNodeChapterIndex = function(obj, index) {
        var chapterIndex = "1";
        if (index === 0) {
            return chapterIndex;
        } else {
            if (obj[index].level === obj[index - 1].level) {
                var preNode = obj[index - 1];
                var indexArr = preNode.chapterIndex.split(_config.splitChar);
                indexArr[indexArr.length - 1]++;
                chapterIndex = indexArr.join(_config.splitChar);
            } else if (obj[index].level < obj[index - 1].level) {
                var preNode = _getNodeByLevel(obj, obj[index].level, index);
                if (!preNode) {
                    console.error("没有同级的菜单！！后续标签大于前面的索引值");
                    chapterIndex = "NaN";
                } else {
                    var indexArr = preNode.chapterIndex.split(_config.splitChar);
                    indexArr[indexArr.length - 1]++;
                    chapterIndex = indexArr.join(_config.splitChar);
                }
            } else {
                var preNode = obj[index - 1];
                chapterIndex = preNode.chapterIndex + _config.splitChar + "1";
            }
        }
        return chapterIndex;
    }



    var _excludeSpecial = function(s) {
        // 去掉转义字符  
        s = s.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
        // 去掉特殊字符  
        s = s.replace(/[\@\#\$\%\^\&\*\{\}\:\"\L\<\>\?]/);
        s = s.replace(/？》《：“，。；‘/g, "");
        s = s.trim().replace(/ /g, "-")
        return _toCDB(s);
    }

    var _toCDB = function(str) {
        var tmp = "";
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) <= 65248 || str.charCodeAt(i) >= 65375) {
                tmp += String.fromCharCode(str.charCodeAt(i)).toLowerCase();
            }
        }
        return tmp
    }

    var _initDom = function(catJson) {
        var controlDiv = $('<div class="cot-close"><a href="javascript:void(0);">x</a></div>');
        // var listDiv = $('<div class="cot-"><a href="javascript:void(0);">x</a></div>');
        var div = $("<div></div>").addClass('catalogContainer');
        var ul = $("<ul></ul>");

        $.each(catJson, function(index, el) {
            var catali = $("<li></li>").addClass('item').css({
                "padding-left": ((el.level - 2) * 10) + "px"
            });
            var cata = $("<a></a>").html(el.chapterIndex + " " + el.text).attr({
                "href": '#' + el.achorName
            });
            catali.append(cata);
            ul.append(catali);
        });
        div.height(catJson.length * 21);
        div.append(ul);
        return div;
    }

    var _getMaxTilte = function(obj) {

        return;
    }


    var _bindMove = function(dom) {

        var $dom = $(dom);
        console.log($dom);

        var isMove = false;
        $dom.on('mousedown', function(event) {
            event.preventDefault();
            $dom.addClass('mock');
            initPos.x = $dom[0].offsetLeft;
            initPos.y = $dom[0].offsetTop;
            if (!pos.x || !pos.y) {
                pos.x = event.pageX;
                pos.y = event.pageY;
            }
            isMove = true;
        }).on('mouseup', function(event) {
            event.preventDefault();
            /* Act on the event */
            $dom.removeClass('mock');
            isMove = false;
        }).on('mousemove', function(event) {
            event.preventDefault();
            /* Act on the event */
            if (isMove) {
                setTimeout(function() {
                    $dom.css({
                        "left": event.pageX - pos.x + initPos.x,
                        "top": event.pageY - pos.y + initPos.y
                    });

                }, 1);

            } else {
                pos.x = event.pageX;
                pos.y = event.pageY;
            }
        });

        $dom.on('touchstart', function(event) {
            event.preventDefault();
            $dom.addClass('mock');
            initPos.x = $dom[0].offsetLeft;
            initPos.y = $dom[0].offsetTop;
            if (!pos.x || !pos.y) {
                pos.x = event.originalEvent.changedTouches[0].pageX;
                pos.y = event.originalEvent.changedTouches[0].pageY;
            }
            isMove = true;
        }).on('touchend', function(event) {
            event.preventDefault();
            /* Act on the event */
            $dom.removeClass('mock');
            isMove = false;
        }).on('touchmove', function(event) {
            event.preventDefault();
            /* Act on the event */
            if (isMove) {
                setTimeout(function() {
                    $dom.css({
                        "left":event.originalEvent.changedTouches[0].pageX - pos.x + initPos.x,
                        "top": event.originalEvent.changedTouches[0].pageY - pos.y + initPos.y
                    });

                }, 1);

            } else {
                pos.x = event.originalEvent.changedTouches[0].pageX;
                pos.y = event.originalEvent.changedTouches[0].pageY;
            }
        });

    }

    var _expandNode = function() {

    }

    var _getDirection = function(c, o) {
        return c > o ? -1 : 1;
    }


    return {
        init: _init
    }
}(jQuery, undefined);