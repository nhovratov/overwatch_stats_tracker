var app = new Vue({
    el: '#app',
    data: {
        history: [],
        matchCounts: {
            "0-4": "0",
            "4-8": "0",
            "8-12": "0",
            "12-16": "0",
            "16-20": "0",
            "20-24": "0",
        },
        matchCountsWeekdays: {
            "Montag": "0",
            "Dienstag": "0",
            "Mittwoch": "0",
            "Donnerstag": "0",
            "Freitag": "0",
            "Samstag": "0",
            "Sonntag": "0",
        },
        dataProvider: [{
            "category": "Win Percent",
            "0-4": "0",
            "4-8": "0",
            "8-12": "0",
            "12-16": "0",
            "16-20": "0",
            "20-24": "0",
        }],
        dataProviderWeekdays: [{
            "category": "Win Percent",
            "Montag": "0",
            "Dienstag": "0",
            "Mittwoch": "0",
            "Donnerstag": "0",
            "Freitag": "0",
            "Samstag": "0",
            "Sonntag": "0"
        }],
    },

    beforeMount: function () {
        this.fetchHistory();
        moment.updateLocale('de', {
            weekdays: [
                'Sonntag',
                'Montag',
                'Dienstag',
                'Mittwoch',
                'Donnerstag',
                'Freitag',
                'Samstag'
            ]
        });
    },

    methods: {

        fetchHistory: function () {
            fetch('/api/history')
                .then(res => res.json())
                .then(res => {
                    this.history = res;
                })
                .then(() => {
                    this.calculateWinPercent();
                    this.calculateWinPercentWeekdays();
                    this.makeChart();
                })
        },

        calculateWinPercent: function () {
            var data = {
                "0-4": [],
                "4-8": [],
                "8-12": [],
                "12-16": [],
                "16-20": [],
                "20-24": [],
            };
            moment.locale('de');
            this.history.forEach((match, index) => {
                if (parseInt(match.change) === 0) {
                    return;
                }
                var win = parseInt(match.change) > 0;
                var date = moment(match.date).format('HH');
                if (date >= 0 && date < 4) {
                    data["0-4"].push(win);
                } else if (date >= 4 && date < 8) {
                    data["4-8"].push(win);
                } else if (date >= 8 && date < 12) {
                    data["8-12"].push(win);
                } else if (date >= 12 && date < 16) {
                    data["12-16"].push(win);
                } else if (date >= 16 && date < 20) {
                    data["16-20"].push(win);
                } else if (date >= 20 && date < 24) {
                    data["20-24"].push(win);
                } else {
                    return false;
                }
            });
            Object.keys(data).map(function (objectKey, index) {
                var length = data[objectKey].length;
                app.matchCounts[objectKey] = length;
                var wins = 0;
                data[objectKey].forEach((value) => {
                    if (value) {
                        wins += 1;
                    }
                });
                app.dataProvider[0][objectKey] = ((wins / length) * 100).toFixed(2);
            });
        },

        calculateWinPercentWeekdays: function () {
            var data = {
                "Montag": [],
                "Dienstag": [],
                "Mittwoch": [],
                "Donnerstag": [],
                "Freitag": [],
                "Samstag": [],
                "Sonntag": []
            };
            moment.locale('de');
            this.history.forEach((match, index) => {
                if (parseInt(match.change) === 0) {
                    return;
                }
                var win = parseInt(match.change) > 0;
                var weekday = moment(match.date).format('dddd');
                data[weekday].push(win);
            });
            Object.keys(data).map(function (key, index) {
                var length = data[key].length;
                app.matchCountsWeekdays[key] = length;
                var wins = 0;
                data[key].forEach((value) => {
                    if (value) {
                        wins += 1;
                    }
                });
                app.dataProviderWeekdays[0][key] = ((wins / length) * 100).toFixed(2);
            });
        },

        makeChart: function () {
            AmCharts.makeChart("chartdiv",
                {
                    "type": "serial",
                    "categoryField": "category",
                    "rotate": true,
                    "startDuration": 1,
                    "fontSize": 12,
                    "theme": "default",
                    "categoryAxis": {
                        "gridPosition": "start"
                    },
                    "trendLines": [],
                    "graphs": [
                        {
                            "balloonText": "[[title]]: [[value]]% (" + app.matchCounts["0-4"] + ")",
                            "fillAlphas": 1,
                            "id": "AmGraph-1",
                            "title": "0-4 Uhr",
                            "fillColors": "#f2803a",
                            "type": "column",
                            "valueField": "0-4"
                        },
                        {
                            "balloonText": "[[title]]: [[value]]% (" + app.matchCounts["4-8"] + ")",
                            "fillAlphas": 1,
                            "id": "AmGraph-2",
                            "title": "4-8 Uhr",
                            "fillColors": "#ffed66",
                            "type": "column",
                            "valueField": "4-8"
                        },
                        {
                            "balloonText": "[[title]]: [[value]]% (" + app.matchCounts["8-12"] + ")",
                            "fillAlphas": 1,
                            "id": "AmGraph-3",
                            "title": "8-12 Uhr",
                            "fillColors": "#4bdd79",
                            "type": "column",
                            "valueField": "8-12"
                        },
                        {
                            "balloonText": "[[title]]: [[value]]% (" + app.matchCounts["12-16"] + ")",
                            "fillAlphas": 1,
                            "id": "AmGraph-4",
                            "title": "12-16 Uhr",
                            "fillColors": "#4ba0dd",
                            "type": "column",
                            "valueField": "12-16"
                        },
                        {
                            "balloonText": "[[title]]: [[value]]% (" + app.matchCounts["16-20"] + ")",
                            "fillAlphas": 1,
                            "id": "AmGraph-5",
                            "title": "16-20",
                            "fillColors": "#c45fe2",
                            "type": "column",
                            "valueField": "16-20"
                        },
                        {
                            "balloonText": "[[title]]: [[value]]% (" + app.matchCounts["20-24"] + ")",
                            "fillAlphas": 1,
                            "id": "AmGraph-6",
                            "title": "20-24",
                            "type": "column",
                            "fillColors": "#ef477d",
                            "valueField": "20-24"
                        },
                    ],
                    "guides": [],
                    "valueAxes": [
                        {
                            "id": "ValueAxis-1",
                            "title": ""
                        }
                    ],
                    "allLabels": [],
                    "balloon": {},
                    "legend": {
                        "enabled": true,
                        "useGraphSettings": true
                    },
                    "titles": [
                        {
                            "id": "Winrate nach Uhrzeit",
                            "size": 15,
                            "text": "Winrate nach Uhrzeit"
                        }
                    ],
                    "dataProvider": this.dataProvider
                }
            );

            AmCharts.makeChart("chartdivWeekdays",
                {
                    "type": "serial",
                    "categoryField": "category",
                    "rotate": true,
                    "startDuration": 1,
                    "fontSize": 12,
                    "theme": "default",
                    "categoryAxis": {
                        "gridPosition": "start"
                    },
                    "trendLines": [],
                    "graphs": [
                        {
                            "balloonText": "[[title]]: [[value]]% (" + app.matchCountsWeekdays["Montag"] + ")",
                            "fillAlphas": 1,
                            "id": "AmGraph-1",
                            "title": "Montag",
                            "type": "column",
                            "valueField": "Montag"
                        },
                        {
                            "balloonText": "[[title]]: [[value]]% (" + app.matchCountsWeekdays["Dienstag"] + ")",
                            "fillAlphas": 1,
                            "id": "AmGraph-2",
                            "title": "Dienstag",
                            "type": "column",
                            "valueField": "Dienstag"
                        },
                        {
                            "balloonText": "[[title]]: [[value]]% (" + app.matchCountsWeekdays["Mittwoch"] + ")",
                            "fillAlphas": 1,
                            "id": "AmGraph-3",
                            "title": "Mittwoch",
                            "type": "column",
                            "valueField": "Mittwoch"
                        },
                        {
                            "balloonText": "[[title]]: [[value]]% (" + app.matchCountsWeekdays["Donnerstag"] + ")",
                            "fillAlphas": 1,
                            "id": "AmGraph-4",
                            "title": "Donnerstag",
                            "type": "column",
                            "valueField": "Donnerstag"
                        },
                        {
                            "balloonText": "[[title]]: [[value]]% (" + app.matchCountsWeekdays["Freitag"] + ")",
                            "fillAlphas": 1,
                            "id": "AmGraph-5",
                            "title": "Freitag",
                            "type": "column",
                            "valueField": "Freitag"
                        },
                        {
                            "balloonText": "[[title]]: [[value]]% (" + app.matchCountsWeekdays["Samstag"] + ")",
                            "fillAlphas": 1,
                            "id": "AmGraph-6",
                            "title": "Samstag",
                            "type": "column",
                            "valueField": "Samstag"
                        },
                        {
                            "balloonText": "[[title]]: [[value]]% (" + app.matchCountsWeekdays["Sonntag"] + ")",
                            "fillAlphas": 1,
                            "id": "AmGraph-7",
                            "title": "Sonntag",
                            "type": "column",
                            "valueField": "Sonntag"
                        },
                    ],
                    "guides": [],
                    "valueAxes": [
                        {
                            "id": "ValueAxis-1",
                            "title": ""
                        }
                    ],
                    "allLabels": [],
                    "balloon": {},
                    "legend": {
                        "enabled": true,
                        "useGraphSettings": true
                    },
                    "titles": [
                        {
                            "id": "Winrate nach Wochentag",
                            "size": 15,
                            "text": "Winrate nach Wochentag"
                        }
                    ],
                    "dataProvider": this.dataProviderWeekdays
                }
            );
        }

    },


});


