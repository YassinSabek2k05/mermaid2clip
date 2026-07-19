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
