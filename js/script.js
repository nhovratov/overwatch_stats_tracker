var app = new Vue({
    el: '#app',
    data: {
        newMatch: '',
        isSaved: true,
        notSavedEntriesCount: 0,
        history: [],
        chunkedMonths: [],
        currentSeason: {},
        seasons: [
            {
                season: 9,
                dateStart: moment('2018-02-28'),
                dateEnd: moment('2018-04-28')
            },
            {
                season: 10,
                dateStart: moment('2018-05-01'),
                dateEnd: moment('2018-07-01')
            },
            {
                season: 11,
                dateStart: moment ('20118-07-01'),
                dateEnd: moment ('2018-09-01'),
            }
        ]
    },

    beforeMount: function () {
        this.fetchHistory();
    },

    methods: {

        fetchHistory: function () {
            fetch('/api/history')
                .then(res => res.json())
                .then(res => {
                    this.history = res;
                    this.setActiveSeason();
                });
        },

        resetSaveState: function () {
            this.isSaved = true;
            this.notSavedEntriesCount = 0;
        },

        changeClass: function (item) {
            return {
                'alert-success': item.change > 0,
                'alert-danger': item.change < 0,
                'alert-warning': item.change === 0
            }
        },

        pushEntry: function () {
            var points = parseInt(this.newMatch);
            this.newMatch = '';

            app.history.push({
                points: points,
                change: this.getPointsChange(points),
                date: Date.now()
            });
            this.isSaved = false;
            this.notSavedEntriesCount++;
            this.updateView();
        },

        getPointsChange: function (newPoints) {
            var change = 0;
            if (this.history.length > 0 && this.filterByCurrentSeason().length > 0) {
                change = newPoints - this.history[0].points;
            }
            return change;
        },

        formatDate: function (date) {
            moment.locale('de');
            moment.weekdays(true, 1);
            moment.updateLocale('de', {
                weekdays: [
                    'Sonntag',
                    'Montag',
                    'Dienstag',
                    'Mittwoch',
                    'Donnerstag',
                    'Freitag',
                    'Samstag'
                ],
                months: [
                    'Januar',
                    'Februar',
                    'März',
                    'April',
                    'Mai',
                    'Juni',
                    'Juli',
                    'August',
                    'September',
                    'Oktober',
                    'November',
                    'Dezember'
                ]
            });
            return moment(date).format('DD. MMMM YYYY / HH:mm / dddd');
        },

        dateClass: function (item) {
            var date = parseInt(moment(item.date).format('H'));
            return {
                'bg-green': date >= 8 && date < 12,
                'bg-blue': date >= 12 && date < 16,
                'bg-lila': date >= 16 && date < 20,
                'bg-red': date >= 20 && date < 24,
                'bg-orange': date >= 0 && date < 4,
                'bg-yellow': date >= 4 && date < 8
            }
        },

        rankTier: function (item) {
            var points = item.points;
            switch (true) {
                case points < 1500:
                    return 'bronze';
                    break;
                case points >= 1500 && points < 2000:
                    return 'silver';
                    break;
                case points >= 2000 && points < 2500:
                    return 'gold';
                    break;
                case points >= 2500 && points < 3000:
                    return 'platinum';
                    break;
                case points >= 3000 && points < 3500:
                    return 'diamond';
                    break;
                case points >= 3500 && points < 4000:
                    return 'master';
                    break;
                case points >= 4000:
                    return 'grandmaster'
            }

        },

        historyDescending: function () {
            return this.history.sort(function (x, y) {
                return y.date - x.date;
            });
        },

        saveData: function () {
            var form = new FormData();
            form.append('history', JSON.stringify(this.history));
            fetch(new Request('/api/history/push', {
                method: 'POST',
                body: form
            })).then(() => {
                this.fetchHistory();
                this.resetSaveState();
            });
        },

        updateView: function () {
          this.generateChunkedMonths();
        },

        saveEntryWithButton: function (e) {
            var input = document.getElementById('newMatch');
            if (input.value !== '') {
                e.preventDefault();
                var points = parseInt(input.value);
                this.pushEntry({
                    points: points,
                    change: points,
                    date: Date.now()
                });
                this.saveData();
            } else if (this.isSaved) {
                e.preventDefault();
            } else {
                e.preventDefault();
                this.saveData();
            }
        },

        removeLastEntry: function () {
            if (!moment(this.history[0].date).isBetween(this.getCurrentSeason().dateStart, this.getCurrentSeason().dateEnd)) {
                return;
            }
            this.history.shift();
            this.isSaved = false;
            this.notSavedEntriesCount++;
            this.updateView();
        },

        showMore: function (week) {
            week.displayMatchesCount = week.matches.length;
        },

        generateChunkedMonths: function () {
            var history = this.historyDescending();
            history = this.filterByCurrentSeason(history);
            var temparray = [];
            var curKey = '';
            var nextKey = '';
            if (history.length === 0) {
                this.chunkedMonths = [];
                return false;
            }
            var setDifference = function (temparray) {
                var weekObj = temparray[temparray.length - 1] || {};
                var matchesOfWeek = weekObj.matches;
                weekObj.difference = matchesOfWeek[0].points - matchesOfWeek[matchesOfWeek.length - 1].points;
                weekObj.displayMatchesCount = 15;
                return weekObj;
            };
            for (var i = 0; i < history.length; i++) {
                nextKey = moment(history[i].date).format('WW.YY');
                if (curKey !== nextKey) {
                    var weekObj = {};
                    if (temparray.length > 0) {
                        setDifference(temparray);
                    }
                    curKey = nextKey;
                    weekObj.week = curKey;
                    weekObj.matches = [];
                    temparray.push(weekObj);
                    weekObj = {};
                }
                temparray[temparray.length - 1].matches.push(history[i]);
            }
            setDifference(temparray);
            this.chunkedMonths = temparray;
        },

        getCurrentSeason: function () {
            var currentSeason = {};
            this.seasons.forEach(function (season) {
               if (moment().isBetween(season.dateStart, season.dateEnd)) {
                   currentSeason =  season;
                   return;
               }
            });
            return currentSeason;
        },

        setActiveSeason: function () {
          this.currentSeason = this.getCurrentSeason();
          this.updateView();
        },

        setCurrentSeason: function (season) {
            this.currentSeason = season;
            this.updateView();
        },

        filterByCurrentSeason: function (history) {
            var history = history || app.history;
            return history.filter(function (match) {
                return moment(match.date).isBetween(app.currentSeason.dateStart, app.currentSeason.dateEnd);
            });
        },

        isCurrentSeason: function () {
            return this.currentSeason.season === this.getCurrentSeason().season;
        }

    },
    filters: {

        imagesrc: function (image) {
            return '/images/' + image + '.png';
        },

        change: function (change) {
            if (change > 0) {
                return "+" + change;
            }
            return change;
        }

    },

    computed: {

    }

});
