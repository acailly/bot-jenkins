# bot-jenkins

Monitor Jenkins jobs

## Usage

```
Usage: jenkins [options]

  Alias: jk

  Monitor Jenkins jobs

  Options:

    --help  output usage information
```

## Config (config.yaml)

```yaml
jenkins:
  host: http://insert_your_host_ip
  levelColors:
    0: insert
    1: your
    2: jenkins
    3: colors
  jobs:
    - insert
    - the
    - jobs
    - you
    - want
    - to
    - monitor
```

Note: don't put spaces in job names, replace them with `%20`
