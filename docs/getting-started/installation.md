# Installation

## Python setup

Prefect requires Python 3.7+

We assume you are familiar with managing a Python installation using tools like `pip`, `conda` or `virtualenv`.

## Installing the latest version

Prefect is published as a Python package. To install the latest 2.0 release, run the following in a shell

```bash
pip install -U "prefect>=2.0.0a"
```

## Installing the bleeding edge

If you'd like to test with the most up-to-date code, you can install directly off the `orion` branch on GitHub:

```bash
pip install git+https://github.com/PrefectHQ/prefect@orion
```

!!! warning "`orion` may not be stable"
    Please be aware that this method installs unreleased code and may not be stable.

## Installing for development

If you would like to install a version of Prefect for development, first clone the Prefect repository
and then install in editable mode with `pip`:

```bash
git clone https://github.com/PrefectHQ/prefect.git 
# or git clone git@github.com:PrefectHQ/prefect.git if SSH is preferred
cd prefect/
git checkout orion
pip install -e ".[dev]"
```

## Checking your installation

To check that Prefect was installed correctly, you can test the CLI

<div class="termy">
```
$ prefect version
2.0a2
```
</div>

Running this command should print a familiar looking version string to your console.


## External requirements

### SQLite

SQLite cannot be packaged with the installation, but is the default backing database.
Most systems will have SQLite installed already. We require a minimum version of 3.24.0.
