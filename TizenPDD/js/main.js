var backEventListener = null;

var db;
var version = 1.0;
var dbName = 'PddBD';
var dbDisplayName = 'tizen_pdd_db';
var dbSize = 2 * 1024 * 1024;
var sizeTable = 6;

var questions;
var numberQuestion = 0;
var score = 0;
var mistake = 0;
var rightAnswer;
var listRandomNumber = new Array();

var unregister = function() {
    if (backEventListener !== null) {
        document.removeEventListener('tizenhwkey', backEventListener);
        backEventListener = null;
        window.tizen.application.getCurrentApplication().exit();
    }
}

//Initialize function
var init = function() {
    // register once
    if (backEventListener !== null) {
        return;
    }

    // TODO:: Do your initialization job
    console.log('init() called');

    var backEvent = function(e) {
        if (e.keyName == 'back') {
            try {
                if ($.mobile.urlHistory.activeIndex <= 0) {
                    // if first page, terminate app
                    unregister();
                } else {
                    // move previous page
                    $.mobile.urlHistory.activeIndex -= 1;
                    $.mobile.urlHistory.clearForward();
                    window.history.back();
                }
            } catch (ex) {
                unregister();
            }
        }
    }
    openDB();
    // createTable();


    startTimer();
    getAllDataFromDB(function(questionArray) {
        for (var i = 0; i < questionArray.length; i++) {
            console.log(questionArray[i].question);
        }
        questions = questionArray;
        showTasks(questions);
    }, 20);

    $('#btn_next_question').bind("click", function(event, ui) {
    	var isRight = true;
    	if( $("#right-answer").html() != '') {
            nextQuestion();
        }
        else if ($("input:radio:checked").val() == rightAnswer) {
            score++;
            nextQuestion();
        }
        else{
        	console.log("NEVERNO");
        	mistake++;
        	if(mistake<=2){
        		addQuestions();
        	}
        	$("#right-answer").html("Неправильно, верный ответ: "+rightAnswer);
        }
        
    });
    

    // $('#label').text("http://driverslicensetest.net");
    // add eventListener for tizenhwkey (Back Button)
    document.addEventListener('tizenhwkey', backEvent);
    backEventListener = backEvent;
};

function nextQuestion(){
	 if(numberQuestion<19) {
	    $("#right-answer").html("");
        numberQuestion = numberQuestion + 1;
        showTasks(questions);
    }else{
    	showResults();
    };
}

function openDB() {
    db = openDatabase(dbName, version, dbDisplayName, dbSize,
        function(database) {
            //    alert("database opened");
        });
};

function createTable() {
    db.transaction(function(t) {
        t.executeSql('CREATE TABLE PddQuestions (id INTEGER PRIMARY KEY, question TEXT, answer1 TEXT, ' +
            'answer2 TEXT, answer3 TEXT, answer4 TEXT, rightAnswer int, image TEXT);', []);
    }, function() {
        insertData('Что согласно Правилам понимается под дистанцией?',
            'Только А',
            'Только Б',
            'Только В',
            'А и В', 2, "css/images/20_390.jpg");
        insertData('Сколько пересечений проезжих частей имеет этот перекресток?',
            'Одно',
            'Два',
            'Четыре',
            'А и В', 2, "css/images/23_441.jpg");
        insertData('Какие из указанных знаков запрещают движение водителям мопедов?',
            'Только А',
            'Только Б',
            'Все',
            'А и В', 3, "css/images/1_4.jpg");
        insertData('Какие из указанных знаков разрешают разворот?',
            'Только А',
            'А и В',
            'Все',
            'Только В', 3, "css/images/40_783.jpg");
        insertData('Разрешается ли Вам перестроиться?',
            '1. Разрешается только на соседнюю полосу.',
            '2. Разрешается, если скорость грузового автомобиля менее 30 км/ч.',
            '3. Запрещается',
            'А и В', 1, "css/images/8_145.jpg");
        insertData('Эти знаки предупреждают Вас:',
            '1. О наличии через 500 м опасных поворотов.',
            '2. О том, что на расстоянии 150—300 м за дорожным знаком начнется участок дороги протяженностью 500 м с опасными поворотами.',
            '3. О том, что сразу за знаком начнется участок протяженностью 500 м с опасными поворотами.',
            'А и В', 3, "css/images/4_62.jpg");
        insertData('Сколько пересечений проезжих частей имеет этот перекресток?',
            'Одно',
            'Два',
            'Четыре',
            'А и В', 2, "css/images/23_441.jpg");
        insertData('Дает ли преимущество в движении подача сигнала указателями поворота?',
            '1. Дает преимущество.',
            '2. Дает преимущество только при завершении обгона.',
            '3. Не дает преимущества.',

            'А и В', 3, "null");
        insertData('Допускается ли движение автомобилей по тротуарам или пешеходным дорожкам?',
            '1. Допускается.',
            '2. Допускается только при доставке грузов к торговым и другим предприятиям, расположенным непосредственно у тротуаров или пешеходных дорожек, если отсутствуют другие возможности подъезда.',
            '3. Не допускается.',
            'А и В', 2, "null");
        insertData('Обязаны ли Вы в данной ситуации включить указатели левого поворота?',
            '1. Обязаны.',
            '2. Обязаны, если будете выполнять разворот.',
            '3. Не обязаны.',
            'А и В', 1, "css/images/22_427.jpg");
        insertData('Можно ли Вам выполнить разворот?',
            '1. Нельзя.',
            '2. Можно только по траектории А.',
            '3. Можно только по траектории Б.',
            'А и В', 1, "css/images/33_649.jpg");
        insertData('В каких случаях на дорогах, проезжая часть которых разделена линиями разметки, водители обязаны двигаться строго по полосам?',
            '1. Только при интенсивном движении.',
            '2. Только если полосы движения обозначены сплошными линиями разметки.',
            '3. Во всех случаях.',
            'А и В', 3, "null");
        insertData('Разрешено ли Вам выполнить обгон?',
            '1. Разрешено.',
            '2. Разрешено, если скорость грузового автомобиля менее 30 км/ч.',
            '3. Запрещено.',
            'А и В', 3, "css/images/24_471.jpg");
        insertData('Как следует поступить в данной ситуации?',
            '1. Проедете перекресток первым.',
            '2. Уступите дорогу обоим трамваям.',
            '3. Уступите дорогу только трамваю Б.',
            '4.', 2, "css/images/40_793.jpg");
        insertData('В каком случае Вы должны будете уступить дорогу автомобилю ДПС?',
            '1. Если на автомобиле ДПС будут включены проблесковые маячки синего цвета',
            '2. Если на автомобиле ДПС одновременно будут включены проблесковые маячки синего цвета и специальный звуковой сигнал.',
            '3. В любом.',
            'А и В', 2, "css/images/6_115.jpg");
        insertData('Вы намерены повернуть налево. Ваши действия?',
            '1. Выполните маневр без остановки на перекрестке.',
            '2. Повернете налево и остановитесь в разрыве разделительной полосы. Дождетесь разрешающего сигнала светофора на выезде с перекрестка и завершите маневр.',
            '3. Остановитесь перед полосой',
            'А и В', 1, "css/images/22_433.jpg");
        insertData('Как следует поступить в этой ситуации, если Вам необходимо повернуть направо?',
            '1. Остановиться и дождаться другого сигнала регулировщика.',
            '2. Повернуть направо, уступив дорогу пешеходам.',
            '3. Повернуть направо, имея преимущество в движении перед пешеходами.',
            'А и В', 2, "css/images/23_453.jpg");
        insertData('О каких травмах у пострадавшего может свидетельствовать поза «лягушки» (ноги согнуты в коленях и разведены, а стопы развернуты подошвами друг к другу) и какую первую помощь необходимо при этом оказать?',
            '1. У пострадавшего могут быть ушиб брюшной стенки, перелом лодыжки, перелом костей стопы. При первой помощи вытянуть ноги, наложить шины на обе ноги от голеностопного сустава до подмышки.',
            '2. У пострадавшего могут быть переломы шейки бедра, костей таза, перелом позвоночника, повреждение внутренних органов малого таза, внутреннее кровотечение. Позу ему не менять, ноги не вытягивать, шины не накладывать. При первой помощи подложить под колени валик из мягкой ткани, к животу по возможности приложить холод.',
            '3. У пострадавшего могут быть переломы костей голени и нижней трети бедра. При первой помощи нало- жить шины только на травмированную ногу от голеностопного до коленного сустава, не вытягивая ногу.',
            'А и В', 2, "null");
        insertData('В темное время суток и в пасмурную погоду скорость встречного автомобиля воспринимается:',
            '1. Ниже, чем в действительности.',
            '2. Восприятие скорости не меняется.',
            '3. Выше, чем в действительности.',
            'А и В', 1, "null");
        insertData('Является ли безопасным движение вне населенного пункта на легковом автомобиле в темное время суток с включенным ближним светом фар по неосвещенному участку дороги со скоростью 90 км/ч?',
            '1. Является безопасным, поскольку предельная допустимая скорость соответствует требованиям Правил.',
            '2. Является безопасным при малой интенсивности движения.',
            '3. Не является безопасным, поскольку остановочный путь превышает расстояние видимости.',
            'А и В', 3, "null");
    });
};

function insertData(question, answer1, answer2, answer3, answer4, rightAnswer, image) {
    db.transaction(function(t) {
        t.executeSql('INSERT INTO PddQuestions(question, answer1, answer2, answer3, answer4,rightAnswer, image) VALUES (?, ?, ?, ?, ?,?, ?)', [question, answer1, answer2, answer3, answer4, rightAnswer, image],
            onSuccess, onError);
    });
};

function getAllDataFromDB(callback, countQuestion) {
    var tasks = [];
    db.transaction(function(t) {

        t.executeSql('SELECT * FROM PddQuestions', [],
            function(sqlTransaction, sqlResultSet) {
                var i, j, tasksNumber = sqlResultSet.rows.length;
                for (i = 0; i < 5; i++) {
                    tasks[i] = new Array();
                    var random = rand(0, 20, function(number) {
                    	console.log(number);
                        var task = sqlResultSet.rows.item(number);
                        tasks[i].push(task.question, task.answer1, task.answer2, task.answer3, task.answer4, task.rightAnswer, task.image);
                        console.log("QUESTION FROM BD:" + task.question);
                    });

                };
                callback(tasks);
            });
    });
    //if ( typeof(callback) === "function") {
    //         callback(tasks);
       // }
    //return tasks;
};

function rand(min, max, callback) {
    number = Math.floor(Math.random() * (max + 1 - min) + min);
    for (i = 0; i < listRandomNumber.length; i++) {
        if (listRandom[i] == number) {
            rand(min, max);
        } else {
            listRandomNumber.push(number);
            console.log("SUCCESS ADD RANDOM");
        };
    };
     callback(number);
}
function addQuestions() {
	getAllDataFromDB(function(questionArray) {
		for(i=0; i<questionArray.length; i++){
	        questions.push(questionArray[i]);
		}
        console.log(questions.length);
    }, 5);
}

function onSuccess() {
    //alert("Task added!");
    //getAllDataFromDB();
    console.log("SUCCESS");
}

function onError() {
    alert('Error insert data');
}

function onErrorGetData() {
    alert('Error get Data');
}

function showTasks(tasks) {
    console.log(tasks.length);
    $('#question').text(tasks[numberQuestion][0]);

    $("#a1").text(tasks[numberQuestion][1]);

    $('#a2').text(tasks[numberQuestion][2]);

    $('#a3').text(tasks[numberQuestion][3]);

    $('#a4').text(tasks[numberQuestion][4]);
    rightAnswer = tasks[numberQuestion][5];

    if (tasks[numberQuestion][6] == "null") {
        $('#image-box').empty();
    } else {
        $('#image-box').html("<img id='img' src='' width='device-width' style='margin-right:10px;' height=150/>");
        $('#img').attr("src", tasks[numberQuestion][6]);
    }


};

function startTimer() {
    var my_timer = $('span#my_timer').text();
    var arr = my_timer.split(':');
    var m = arr[0];
    var s = arr[1];
    if (s == 0) {

        if (m == 0) {
            alert('Время вышло');
            showResults();
            return;
        }
        m--;
        if (m < 10) m = "0" + m;
        s = 59;
    } else s--;
    if (s < 10) s = "0" + s;

    $('span#my_timer').html(m + ":" + s);
    setTimeout(startTimer, 1000);

}

function showResults() {
   // window.localStorage.setItem('score', score);
    window.localStorage.setItem('mistake', mistake);
    window.open("Results.html");
}

$(document).bind('pageinit', init);
$(document).unload(unregister);