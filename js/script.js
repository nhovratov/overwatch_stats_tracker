var app = new Vue({
    el: '#app',
    data: {
        newMatch: '',
        history: jsonHistory
    },
    methods: {
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
            var change = 0;
            if (this.history.length > 0) {
                change = points - app.history[app.history.length - 1].points;
            }
            app.history.push({
                points: points,
                change: change,
                date: Date.now()
            });
            document.getElementById('saving').querySelector('input[name=history]').value = JSON.stringify(this.history);
        },

        formatDate: function (date) {
            moment.locale('de');
            moment.weekdays(true, 1);
            moment.updateLocale('de', {
                weekdays : [
                    'Sonntag',
                    'Montag',
                    'Dienstag',
                    'Mittwoch',
                    'Donnerstag',
                    'Freitag',
                    'Samstag'
                ]
            });
            return moment(date).format('dddd (DD MMMM YYYY | HH:mm)');
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
    }
});
