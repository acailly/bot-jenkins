const path = require("path");
const jsonfile = require("jsonfile");
const Rx = require("rx");
const request = require("request");
const chalk = require("chalk");

const observableRequest = Rx.Observable.fromNodeCallback(request);

const fetchJobStatus = function(vorpal, callback) {
  const jobList = vorpal.config.jenkins.jobs;

  Rx.Observable
    // For every job
    .from(jobList)
    // We start a request
    .concatMap(job =>
      observableRequest(
        vorpal.config.jenkins.host + "/job/" + job + "/api/json"
      )
    )
    // We get the job status
    .map(([response, body]) => {
      try {
        const jobStatus = JSON.parse(body);
        return [jobStatus.displayName, jobStatus.color];
      } catch (e) {
        return ["Unknown job", "red"];
      }
    })
    // We filter falsy results
    .filter(x => !!x)
    // We parse the job status
    .map(([name, status]) => {
      var level = 0;
      var anime = false;

      if (/^.*_anime$/.test(status)) {
        anime = true;
      }

      if (/^blue.*$/.test(status)) {
        level = 2;
      }
      if (/^yellow.*$/.test(status)) {
        level = 1;
      }
      if (/^red.*$/.test(status)) {
        level = 0;
      }
      if (/^aborted.*$/.test(status)) {
        level = 3;
      }
      if (/^disabled$/.test(status)) {
        level = 2;
      }

      return [name, level, anime];
    })
    // We show the status in the console
    .subscribe(
      ([name, level, anime]) => {
        const colorize = chalk[vorpal.config.jenkins.levelColors[level]];

        let message = name;
        if (anime) {
          message += " (RUNNING)";
        }

        this.log(colorize(message));
        // TODO Use callback instead of log
      },
      err => {
        callback("Error: " + err);
      },
      () => callback()
    );
};

module.exports = function(vorpal) {
  vorpal
    .command("jenkins")
    .alias("jk")
    .description("Monitor Jenkins jobs")
    .action(function(args, callback) {
      fetchJobStatus.call(this, vorpal, callback);
    });
};
