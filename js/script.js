var app = new Vue({
    el: '#app',
    data: {
        newMatch: '',
        history: jsonHistory
    },
    methods: {
        changeClass: function (item) {
            return {
                'text-success': item.change > 0,
                'text-danger': item.change < 0,
                'text-warning': item.change === 0
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
            return moment(date).format('D.M.Y H:m:s');
        },

        dateClass: function (item) {
            var date = parseInt(moment(item.date).format('H'));
            return {
                'bg-green': date >= 8 && date < 12,
                'bg-blue': date >= 12 && date < 16,
                'bg-lila': date >= 16 && date < 20,
                'bg-red': date >= 20 && date < 24,
                'bg-orange': date >= 24 && date < 4,
                'bg-yellow': date >= 4 && date < 8
            }
        }

    }
});
