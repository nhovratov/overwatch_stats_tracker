var app = new Vue({
    el: '#app',
    data: {
        history: []
    },
    beforeMount: function () {
        this.fetchHistory();
    },
    mounted: function () {
        this.initFullCalendar();
    },
    methods: {

        initFullCalendar: function () {
            $('#fullcalendar').fullCalendar({
                events: [
                    {
                        start: '2018-04-24',
                        overlap: false,
                        rendering: 'background',
                        color: '#ff9f89'
                    },
                    {
                        start: '2018-04-06',
                        overlap: false,
                        rendering: 'background',
                        color: '#ff9f89'
                    },
                ]
            });
        },

        fetchHistory: function () {
            fetch('/api/history')
                .then(res => res.json())
                .then(res => {
                    this.history = res;
                });
        },

    },
});
