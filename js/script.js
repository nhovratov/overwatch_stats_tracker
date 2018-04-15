var app = new Vue({
    el: '#app',
    data: {
        history: [
            {points: 2621, date: '', change: 0},
            {points: 2601, change: -20, date: ''},
            {points: 2624, change: 23, date: ''},
            {points: 2599, change: -25, date: ''}
        ]
    },
    methods: {
        changeClass: function (item) {
            return {
                'text-success': item.change > 0,
                'text-danger': item.change < 0,
                'text-warning': item.change === 0
            }
        },

        pushEntry: function (points) {
            app.history.push({
                points: points,
                change: points - app.history[app.history.length - 1].points,
                date: Date.now()
            });
        },

        formatDate: function (date) {
          return moment(date).format('E.M.Y H:m:s');
        }
    }
});
