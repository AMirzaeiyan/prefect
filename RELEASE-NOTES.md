# Orion Release Notes

## 2.0a8

The 2.0a7 release required users to pull Docker images (e.g. `docker pull prefecthq/prefect:2.0a7-python3.8`) before the agent could run flows in Docker.

This release adds pull policies to the `DockerFlowRunner` allowing full control over when your images should be pulled from a registry. We infer reasonable defaults from the tag of your image, following the behavior of [Kubernetes image pull policies](https://kubernetes.io/docs/concepts/containers/images/#image-pull-policy).

## 2.0a7

### Flow Runners

On the heels of the recent rename of Onion's `Executor` to `TaskRunner`, this release introduces `FlowRunner`, an analogous concept that specifies the infrastructure that a flow runs on. Just as a task runner can be specified for a flow, which encapsulates tasks, a flow runner can be specified for a deployment, which encapsulates a flow. This release includes two flow runners, which we expect to be the most commonly used:
- **SubprocessFlowRunner** - The subprocess flow runner is the default flow runner. It allows for specification of a runtime Python environment with `virtualenv` and `conda` support.
- **DockerFlowRunner** - Executes the flow run in a Docker container. The image, volumes, labels, and networks can be customized. From this release on, Docker images for use with this flow runner will be published with each release.

Future releases will introduce runners for executing flows on Kubernetes and major cloud platform's container compute services (e.g. AWS ECS, Google Cloud Run).

### Other enhancements
In addition to flow runners, we added several other enhancements and resolved a few issues, including:
- Corrected git installation command in docs
- Refined UI through color, spacing, and alignment updates
- Resolved memory leak issues associated with the cache of session factories
- Improved agent locking of double submitted flow runs and handling for failed flow run submission

## 2.0a6

### Subflows and Radar follow up
With the 2.0a5 release, we introduced the ability to navigate seamlessly between subflows and parent flows via Radar. In this release, we further enabled that ability by:
- Enabling the dedicated subflow runs tab on the Flow Run page
- Tracking of upstream inputs to subflow runs
- Adding a flow and task run count to all subflow run cards in the Radar view
- Adding a mini Radar view on the Flow run page

### Task Runners
Previous versions of Prefect could only trigger execution of code defined within tasks. Orion can trigger execution of significant code that can be run _outside of tasks_. In order to make the role previously played by Prefect's `Executor` more explicit, we have renamed `Executor` to `TaskRunner`.

A related `FlowRunner` component is forthcoming.

### Other enhancements
In addition to task runners and subflow UI enhancements, we added several other enhancements and resolved a few issues, including:
- Introduced dependency injection pathways so that Orion's database access can be modified after import time
- Enabled the ability to copy the run ID from the flow run page
- Added additional metadata to the flow run page details panel
- Enabled and refined dashboard filters to improve usability, reactivity, and aesthetics
- Added a button to remove filters that prevent deployments without runs from displaying in the dashboard
- Implemented response scoped dependency handling to ensure that a session is always committed before a response is returned to the user

## 2.0a5

### Radar: A new way of visualizing workflows
Orion can orchestrate dynamic, DAG-free workflows. Task execution paths may not be known to Orion prior to a run—the graph “unfolds” as execution proceeds. Radar embraces this dynamism, giving users the clearest possible view of their workflows.

Orion’s Radar is based on a structured, radial canvas upon which tasks are rendered as they are orchestrated. The algorithm optimizes readability through consistent node placement and minimal edge crossings. Users can zoom and pan across the canvas to discover and inspect tasks of interest. The mini-map, edge tracing, and node selection tools make workflow inspection a breeze. Radar also supports direct click-through to a subflow from its parent, enabling users to move seamlessly between task execution graphs.

### Other enhancements
While our focus was on Radar, we also made several other material improvements to Orion, including:
- Added popovers to dashboard charts, so you can see the specific data that comprises each visualization
- Refactored the `OrionAgent` as a fully client side construct
- Enabled custom policies through dependency injection at runtime into Orion via context managers

## 2.0a4

We're excited to announce the fourth alpha release of Prefect's second-generation workflow engine.

In this release, the highlight is executors. Executors are used to run tasks in Prefect workflows.
In Orion, you can write a flow that contains no tasks.
It can call many functions and execute arbitrary Python, but it will all happen sequentially and on a single machine.
Tasks allow you to track and orchestrate discrete chunks of your workflow while enabling powerful execution patterns.

[Executors](https://orion-docs.prefect.io/concepts/executors/) are the key building blocks that enable you to execute code in parallel, on other machines, or with other engines.

### Dask integration

Those of you already familiar with Prefect have likely used our Dask executor.
The first release of Orion came with a Dask executor that could run simple local clusters.
This allowed tasks to run in parallel, but did not expose the full power of Dask.
In this release of Orion, we've reached feature parity with the existing Dask executor.
You can [create customizable temporary clusters](https://orion-docs.prefect.io/tutorials/dask-task-runner/#using-a-temporary-cluster) and [connect to existing Dask clusters](https://orion-docs.prefect.io/tutorials/dask-task-runner/#connecting-to-an-existing-cluster).
Additionally, because flows are not statically registered, we're able to easily expose Dask annotations, which allow you to [specify fine-grained controls over the scheduling of your tasks](https://orion-docs.prefect.io/tutorials/dask-task-runner/#annotations) within Dask.


### Subflow executors

[Subflow runs](https://orion-docs.prefect.io/concepts/flows/#subflows) are a first-class concept in Orion and this enables new execution patterns.
For example, consider a flow where most of the tasks can run locally, but for some subset of computationally intensive tasks you need more resources.
You can move your computationally intensive tasks into their own flow, which uses a `DaskExecutor` to spin up a temporary Dask cluster in the cloud provider of your choice.
Next, you simply call the flow that uses a `DaskExecutor` from your other, parent flow.
This pattern can be nested or reused multiple times, enabling groups of tasks to use the executor that makes sense for their workload.

Check out our [multiple executor documentation](https://orion-docs.prefect.io/concepts/executors/#using-multiple-task-runners) for an example.


### Other enhancements

While we're excited to talk about these new features, we're always hard at work fixing bugs and improving performance. This release also includes:

- Updates to database engine disposal to support large, ephemeral server flow runs
- Improvements and additions to the `flow-run` and `deployment` command-line interfaces
    - `prefect deployment ls`
    - `prefect deployment inspect <name>`
    - `prefect flow-run inspect <id>`
    - `prefect flow-run ls`
- Clarification of existing documentation and additional new documentation
- Fixes for database creation and startup issues
