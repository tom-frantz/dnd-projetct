import json

import click
import pathlib


def update_version(target_index, increment=1, set=None):
    assert (
        increment is not None or set is not None
    ), "Increment or Set must have some value"
    with open(pathlib.Path(__file__).parent.parent.joinpath("app.json"), "r+") as f:
        expo = json.load(f)
        version = expo["expo"]["version"].split(".")
        version[target_index] = (
            str(int(version[target_index]) + increment)
            if increment is not None
            else str(set)
        )
        expo["expo"]["version"] = ".".join(version)
        f.seek(0)
        json.dump(expo, f, indent=2)
        f.truncate()


@click.group()
def version():
    pass


@version.command()
def update_major():
    update_version(0)
    update_version(1, None, 0)
    update_version(2, None, 0)


@version.command()
def update_minor():
    update_version(1)
    update_version(2, None, 0)


@version.command()
def update_patch():
    update_version(2)


if __name__ == '__main__':
    # print(pathlib.Path(__file__).parent.parent.joinpath("app.expoAppJson"))
    version()
