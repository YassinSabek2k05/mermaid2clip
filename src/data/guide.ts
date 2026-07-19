export interface Snippet {
  /** Short name shown on the snippet chip. */
  label: string
  /** One-line explanation of what the snippet does. */
  description: string
  /** The Mermaid code that gets inserted. */
  code: string
  /**
   * A full, standalone diagram (has its own diagram header). Clicking one of
   * these offers to replace the whole editor instead of inserting a fragment.
   */
  template?: boolean
}

export interface GuideSection {
  id: string
  /** Diagram family name, e.g. "Flowchart". */
  title: string
  /** One-line description of the diagram type. */
  blurb: string
  snippets: Snippet[]
}

export const GUIDE: GuideSection[] = [
  {
    id: 'flowchart',
    title: 'Flowchart',
    blurb: 'Boxes and arrows for processes, decisions and data flow.',
    snippets: [
      {
        label: 'Full example',
        description: 'A complete flowchart to start from.',
        template: true,
        code: `flowchart LR
    A[Start] --> B{Decision}
    B -->|Yes| C[Do the thing]
    B -->|No| D[Skip it]
    C --> E[(Database)]
    D --> E`,
      },
      {
        label: 'Direction',
        description: 'Set layout direction: TB, TD, BT, LR or RL.',
        code: `flowchart TD`,
      },
      {
        label: 'Node → Node',
        description: 'A basic link between two nodes.',
        code: `A --> B`,
      },
      {
        label: 'Labelled link',
        description: 'An arrow carrying a text label.',
        code: `A -->|label| B`,
      },
      {
        label: 'Decision',
        description: 'Diamond node for yes/no branching.',
        code: `B{Is it valid?}`,
      },
      {
        label: 'Rounded box',
        description: 'A node with rounded corners.',
        code: `A(Rounded)`,
      },
      {
        label: 'Stadium',
        description: 'A pill-shaped node, good for start/end.',
        code: `A([Start])`,
      },
      {
        label: 'Database',
        description: 'Cylinder shape for stores and databases.',
        code: `A[(Database)]`,
      },
      {
        label: 'Circle',
        description: 'A circular node.',
        code: `A((Circle))`,
      },
      {
        label: 'Subgraph',
        description: 'Group related nodes into a labelled box.',
        code: `subgraph Service
    A --> B
end`,
      },
      {
        label: 'Dotted link',
        description: 'A dashed connection.',
        code: `A -.-> B`,
      },
      {
        label: 'Thick link',
        description: 'A bold, emphasised connection.',
        code: `A ==> B`,
      },
    ],
  },
  {
    id: 'styling',
    title: 'Styling',
    blurb: 'Colour and style nodes, links and groups. Works in flowchart, class and state diagrams.',
    snippets: [
      {
        label: 'Full example',
        description: 'A styled flowchart using classDef, inline ::: and class assignment.',
        template: true,
        code: `flowchart TB
    classDef sensor fill:#CB5A2B,stroke:#1C2B4A,color:#fff,stroke-width:2px
    classDef db fill:#1C2B4A,stroke:#CB5A2B,color:#fff,stroke-width:2px
    classDef ok fill:#4CA36A,stroke:#333,color:#fff
    classDef err fill:#D9534F,stroke:#333,color:#fff

    A([Race Start Trigger]) --> B{Timing Source?}

    subgraph Ingestion["Timing Ingestion Layer"]
        B -->|Transponder| C[/Loop Sensor API/]
        B -->|Manual| D[/Scrutineer Entry/]
        C --> E[[Packet Queue]]
        D --> E
        E --> F{Checksum Valid?}
        F -->|No| G[Dead Letter Queue]:::err
        F -->|Yes| H(Normalize Timestamp)
    end

    subgraph Processing["Result Processing"]
        H --> I{Duplicate Lap?}
        I -->|Yes| J[Discard]:::err
        I -->|No| K[Compute Lap Delta]
        K --> L{Within Track Limits?}
        L -->|No| M[Flag for Review]
        L -->|Yes| N[Confirm Lap]:::ok
        M --> O((Steward Queue))
        O --> P{Steward Decision}
        P -->|Approve| N
        P -->|Reject| J
    end

    subgraph Storage["Persistence"]
        N --> Q[(TimescaleDB<br>lap_times)]:::db
        N --> R[(Postgres<br>standings)]:::db
        Q --> S{{Recompute Standings}}
        R --> S
    end

    S --> T[/Championship API/]
    T --> U([Live Leaderboard])
    G -.retry.-> C

    class C,D sensor`,
      },
      {
        label: 'Define a class',
        description: 'A reusable style. Properties: fill, stroke, color, stroke-width, stroke-dasharray.',
        code: `classDef important fill:#CB5A2B,stroke:#1C2B4A,color:#fff,stroke-width:2px`,
      },
      {
        label: 'Apply inline (:::)',
        description: 'Attach a class to a node where you declare it.',
        code: `A[Node]:::important`,
      },
      {
        label: 'Apply with class',
        description: 'Assign a class to one or more existing nodes.',
        code: `class A,B important`,
      },
      {
        label: 'Style one node',
        description: 'Style a single node directly, without a class.',
        code: `style A fill:#1C2B4A,stroke:#CB5A2B,color:#fff`,
      },
      {
        label: 'Dashed border',
        description: 'A dashed outline via stroke-dasharray.',
        code: `style A stroke-dasharray: 5 5`,
      },
      {
        label: 'Style a link',
        description: 'Colour a link by its index (links are numbered from 0).',
        code: `linkStyle 0 stroke:#CB5A2B,stroke-width:2px`,
      },
      {
        label: 'Style all links',
        description: 'Apply one style to every link.',
        code: `linkStyle default stroke:#9fb0d1,stroke-width:1px`,
      },
      {
        label: 'Style a subgraph',
        description: 'Group nodes, then style the group by its id.',
        code: `subgraph Group["My Group"]
    A --> B
end
style Group fill:#243459,stroke:#33456f,color:#fff`,
      },
      {
        label: 'Switch theme',
        description: 'Put this on the first line to change the built-in theme (default, dark, neutral, forest).',
        code: `%%{init: {'theme':'dark'}}%%`,
      },
      {
        label: 'Theme variables',
        description: 'Override individual theme colours (use theme base). Goes on the first line.',
        code: `%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#CB5A2B','lineColor':'#1C2B4A','primaryTextColor':'#fff'}}}%%`,
      },
    ],
  },
  {
    id: 'sequence',
    title: 'Sequence',
    blurb: 'Messages exchanged between participants over time.',
    snippets: [
      {
        label: 'Full example',
        description: 'A complete sequence diagram.',
        template: true,
        code: `sequenceDiagram
    participant U as User
    participant S as Server
    U->>S: Request data
    activate S
    S-->>U: Response
    deactivate S
    Note over U,S: Handshake complete`,
      },
      {
        label: 'Participant',
        description: 'Declare an actor with an alias.',
        code: `participant A as Alice`,
      },
      {
        label: 'Solid message',
        description: 'A synchronous call.',
        code: `A->>B: Message`,
      },
      {
        label: 'Reply',
        description: 'A dashed return message.',
        code: `B-->>A: Reply`,
      },
      {
        label: 'Activation',
        description: 'Show when a participant is busy.',
        code: `activate B
B-->>A: Done
deactivate B`,
      },
      {
        label: 'Note',
        description: 'Annotate one or more participants.',
        code: `Note over A,B: Something happened`,
      },
      {
        label: 'Loop',
        description: 'Repeat a block of messages.',
        code: `loop Every minute
    A->>B: Poll
end`,
      },
      {
        label: 'Alt / else',
        description: 'Conditional branches.',
        code: `alt Success
    A->>B: OK
else Failure
    A->>B: Retry
end`,
      },
      {
        label: 'REST request',
        description: 'A client calling an API endpoint.',
        code: `Client->>API: GET /users/42`,
      },
      {
        label: 'JSON response',
        description: 'An API returning a status and body.',
        code: `API-->>Client: 200 OK (JSON)`,
      },
      {
        label: 'Auth flow',
        description: 'Token exchange before a protected call.',
        code: `Client->>Auth: POST /login
Auth-->>Client: 200 { token }
Client->>API: GET /me (Bearer token)`,
      },
      {
        label: 'Error path',
        description: 'A rejected request.',
        code: `API-->>Client: 401 Unauthorized`,
      },
    ],
  },
  {
    id: 'class',
    title: 'Class',
    blurb: 'Classes, attributes, methods and relationships.',
    snippets: [
      {
        label: 'Full example',
        description: 'A complete class diagram.',
        template: true,
        code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound() void
    }
    class Dog {
        +fetch() void
    }
    Animal <|-- Dog`,
      },
      {
        label: 'Class',
        description: 'A class with attributes and methods.',
        code: `class User {
    +String name
    +login() bool
}`,
      },
      {
        label: 'Inheritance',
        description: 'Child inherits from parent.',
        code: `Parent <|-- Child`,
      },
      {
        label: 'Composition',
        description: 'Whole owns its parts.',
        code: `Order *-- LineItem`,
      },
      {
        label: 'Aggregation',
        description: 'Whole references its parts.',
        code: `Team o-- Player`,
      },
      {
        label: 'Association',
        description: 'A plain relationship with a label.',
        code: `Driver --> Car : drives`,
      },
    ],
  },
  {
    id: 'arrows',
    title: 'Arrows',
    blurb: 'Every UML class relation. Use these inside a classDiagram.',
    snippets: [
      {
        label: 'All relations',
        description: 'A class diagram showing each relation type at once.',
        template: true,
        code: `classDiagram
    Animal <|-- Dog : inheritance
    Vehicle <|.. Car : realization
    Car *-- Engine : composition
    Team o-- Player : aggregation
    Driver --> Car : association
    Order ..> Payment : dependency
    NodeA -- NodeB : link
    Customer "1" --> "*" Order : places`,
      },
      {
        label: 'Inheritance',
        description: 'Child is a kind of Parent. Hollow triangle points to the parent.',
        code: `Parent <|-- Child`,
      },
      {
        label: 'Realization',
        description: 'Class implements an interface. Dashed line, hollow triangle.',
        code: `Interface <|.. Implementation`,
      },
      {
        label: 'Composition',
        description: 'Part cannot exist without the whole. Filled diamond on the whole.',
        code: `Whole *-- Part`,
      },
      {
        label: 'Aggregation',
        description: 'Whole references parts that can exist on their own. Hollow diamond.',
        code: `Whole o-- Part`,
      },
      {
        label: 'Association',
        description: 'One class knows about / uses another. Solid arrow.',
        code: `Source --> Target`,
      },
      {
        label: 'Bidirectional',
        description: 'An association navigable in both directions.',
        code: `ClassA <--> ClassB`,
      },
      {
        label: 'Dependency',
        description: 'One class depends on another. Dashed arrow.',
        code: `Client ..> Service`,
      },
      {
        label: 'Solid link',
        description: 'A plain connection with no arrowhead.',
        code: `ClassA -- ClassB`,
      },
      {
        label: 'Dashed link',
        description: 'A plain dashed connection with no arrowhead.',
        code: `ClassA .. ClassB`,
      },
      {
        label: 'Labelled relation',
        description: 'Add a label describing the relationship.',
        code: `Order --> Product : contains`,
      },
      {
        label: 'Multiplicity',
        description: 'Cardinality at each end (1, *, 0..1, 1..*).',
        code: `Customer "1" --> "*" Order : places`,
      },
    ],
  },
  {
    id: 'architecture',
    title: 'Architecture',
    blurb: 'Cloud services and infrastructure grouped into systems.',
    snippets: [
      {
        label: 'Full example',
        description: 'A complete architecture diagram.',
        template: true,
        code: `architecture-beta
    group api(cloud)[API]

    service db(database)[Database] in api
    service disk(disk)[Storage] in api
    service server(server)[Server] in api

    db:L -- R:server
    disk:T -- B:server`,
      },
      {
        label: 'Group',
        description: 'A boxed system that holds services.',
        code: `group api(cloud)[API]`,
      },
      {
        label: 'Service',
        description: 'A service placed inside a group. Icons: cloud, database, disk, internet, server.',
        code: `service server(server)[Server] in api`,
      },
      {
        label: 'Edge',
        description: 'Link two services by their sides (L, R, T, B).',
        code: `server:R -- L:db`,
      },
      {
        label: 'Internet edge',
        description: 'Connect an external entry point to a service.',
        code: `service net(internet)[Internet]
net:R --> L:server`,
      },
    ],
  },
  {
    id: 'c4',
    title: 'C4 model',
    blurb: 'Software architecture at context and container level.',
    snippets: [
      {
        label: 'Context (full)',
        description: 'A C4 system context diagram.',
        template: true,
        code: `C4Context
    title System context
    Person(user, "Customer", "A user of the app")
    System(app, "My App", "Delivers the service")
    System_Ext(email, "Email System", "Sends notifications")

    Rel(user, app, "Uses")
    Rel(app, email, "Sends email via")`,
      },
      {
        label: 'Container (full)',
        description: 'A C4 container diagram with a boundary.',
        template: true,
        code: `C4Container
    title Containers
    Person(user, "Customer")
    Container_Boundary(c, "My App") {
        Container(web, "Web App", "React", "Serves the UI")
        Container(api, "API", "Node.js", "Business logic")
        ContainerDb(db, "Database", "PostgreSQL", "Stores data")
    }
    Rel(user, web, "Uses", "HTTPS")
    Rel(web, api, "Calls", "JSON/HTTPS")
    Rel(api, db, "Reads and writes")`,
      },
      {
        label: 'Person',
        description: 'A human actor.',
        code: `Person(user, "Customer", "A user")`,
      },
      {
        label: 'System',
        description: 'A software system you own.',
        code: `System(app, "My App", "Description")`,
      },
      {
        label: 'External system',
        description: 'A system outside your control.',
        code: `System_Ext(email, "Email System")`,
      },
      {
        label: 'Relationship',
        description: 'A directed link with a label.',
        code: `Rel(user, app, "Uses")`,
      },
      {
        label: 'Boundary',
        description: 'Group elements into a boundary.',
        code: `Container_Boundary(c, "My App") {

}`,
      },
    ],
  },
  {
    id: 'block',
    title: 'Block',
    blurb: 'Simple system blocks laid out on a grid.',
    snippets: [
      {
        label: 'Full example',
        description: 'A complete block diagram.',
        template: true,
        code: `block-beta
    columns 3
    client["Client"] gateway["API Gateway"] service["Service"]
    client --> gateway
    gateway --> service`,
      },
      {
        label: 'Columns',
        description: 'Set how many blocks sit per row.',
        code: `columns 3`,
      },
      {
        label: 'Block',
        description: 'A single labelled block.',
        code: `api["API"]`,
      },
      {
        label: 'Spacer',
        description: 'Leave an empty grid cell.',
        code: `space`,
      },
      {
        label: 'Arrow',
        description: 'Connect two blocks.',
        code: `api --> db`,
      },
      {
        label: 'Nested block',
        description: 'A group of blocks inside one cell.',
        code: `block:group
    A
    B
end`,
      },
    ],
  },
  {
    id: 'state',
    title: 'State',
    blurb: 'States and the transitions between them.',
    snippets: [
      {
        label: 'Full example',
        description: 'A complete state diagram.',
        template: true,
        code: `stateDiagram-v2
    [*] --> Idle
    Idle --> Running : start
    Running --> Idle : stop
    Running --> [*] : shutdown`,
      },
      {
        label: 'Start / end',
        description: 'Initial and final pseudo-states.',
        code: `[*] --> First
First --> [*]`,
      },
      {
        label: 'Transition',
        description: 'Move between states with a trigger.',
        code: `Idle --> Active : event`,
      },
      {
        label: 'Composite state',
        description: 'A state containing sub-states.',
        code: `state Active {
    [*] --> Loading
    Loading --> Ready
}`,
      },
    ],
  },
  {
    id: 'er',
    title: 'Entity Relationship',
    blurb: 'Database tables and how they relate.',
    snippets: [
      {
        label: 'Full example',
        description: 'A complete ER diagram.',
        template: true,
        code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    CUSTOMER {
        string name
        string email
    }`,
      },
      {
        label: 'One to many',
        description: 'One record relates to many.',
        code: `CUSTOMER ||--o{ ORDER : places`,
      },
      {
        label: 'One to one',
        description: 'Exactly one on each side.',
        code: `USER ||--|| PROFILE : has`,
      },
      {
        label: 'Attributes',
        description: 'Define an entity with columns.',
        code: `ORDER {
    int id
    date created
}`,
      },
    ],
  },
  {
    id: 'gantt',
    title: 'Gantt',
    blurb: 'Tasks and milestones along a timeline.',
    snippets: [
      {
        label: 'Full example',
        description: 'A complete Gantt chart.',
        template: true,
        code: `gantt
    title Project plan
    dateFormat YYYY-MM-DD
    section Design
    Research      :a1, 2026-01-01, 7d
    Wireframes    :after a1, 5d
    section Build
    Development   :2026-01-15, 14d`,
      },
      {
        label: 'Section',
        description: 'Group tasks under a heading.',
        code: `section Phase 1`,
      },
      {
        label: 'Task',
        description: 'A task with an id, start and duration.',
        code: `Task name :id1, 2026-01-01, 5d`,
      },
      {
        label: 'Milestone',
        description: 'A zero-length marker.',
        code: `Launch :milestone, 2026-02-01, 0d`,
      },
    ],
  },
  {
    id: 'pie',
    title: 'Pie',
    blurb: 'Proportions of a whole.',
    snippets: [
      {
        label: 'Full example',
        description: 'A complete pie chart.',
        template: true,
        code: `pie title Traffic sources
    "Search" : 55
    "Direct" : 25
    "Social" : 20`,
      },
      {
        label: 'Slice',
        description: 'A single labelled value.',
        code: `"Label" : 42`,
      },
    ],
  },
  {
    id: 'mindmap',
    title: 'Mindmap',
    blurb: 'Ideas branching out from a central topic.',
    snippets: [
      {
        label: 'Full example',
        description: 'A complete mindmap.',
        template: true,
        code: `mindmap
  root((Project))
    Planning
      Scope
      Timeline
    Build
      Frontend
      Backend`,
      },
    ],
  },
  {
    id: 'gitgraph',
    title: 'Git graph',
    blurb: 'Commits, branches and merges.',
    snippets: [
      {
        label: 'Full example',
        description: 'A complete git graph.',
        template: true,
        code: `gitGraph
    commit
    branch feature
    checkout feature
    commit
    checkout main
    merge feature`,
      },
    ],
  },
  {
    id: 'journey',
    title: 'User journey',
    blurb: 'Steps a user takes, scored by sentiment.',
    snippets: [
      {
        label: 'Full example',
        description: 'A complete user journey.',
        template: true,
        code: `journey
    title Checkout
    section Browse
      View item: 5: User
      Add to cart: 4: User
    section Pay
      Enter details: 2: User
      Confirm: 5: User`,
      },
    ],
  },
]

export const DEFAULT_DIAGRAM = `flowchart LR
    A[Sensor] --> B[Ingestion]
    B --> C{Valid?}
    C -->|Yes| D[(TimescaleDB)]
    C -->|No| E[Dead letter]`
