import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatMenuTrigger } from '@angular/material/menu';
import { Locale } from '../../interfaces/locale';

// Services
import { AppStateService } from '../../services/app-state.service';
import { DataService } from '../../services/data.service';
import { DialogsService } from '../../services/dialogs.service';

@Component({
  selector: 'core-tree',
  templateUrl: './tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreTreeComponent implements OnInit {
  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger;

  treeControl = new NestedTreeControl<Locale>(node => node?.children);
  dataSource = new MatTreeNestedDataSource<Locale>();

  menuPosition = {
    x: '0',
    y: '0',
  };

  constructor(
    public data: DataService,
    public dialogs: DialogsService,
    private appState: AppStateService
  ) {
    this.dataSource.data = [];
  }

  ngOnInit() {
    this.initListeners();
  }

  initListeners() {
    // Update tree data
    this.data.tree$.subscribe(tree => {
      // TODO: https://github.com/angular/components/issues/11381
      this.dataSource.data = null;
      this.dataSource.data = tree;

      // TODO: https://github.com/angular/components/issues/12469
      this.treeControl.dataNodes = tree;
    });


    // Expand node on request
    this.data.expandNodeRequest$.subscribe((expandNode: Locale) => {
      if (expandNode) {
        this.treeControl.expandDescendants(this.data.currentNode$.value);
        this.data.currentNode$.next(expandNode);
      }
    });


    // Right click detect when open menu context
    this.appState.onCdkOverlayRightClick$.subscribe(() => {
      this.matMenuTrigger.closeMenu();
    })
  }

  onNodeClick(node) {
    if (node && node.path !== this.data.currentNode$.value?.path) {
      this.data.currentNode$.next(node);
    }
  }

  onNodeRightClick(event: MouseEvent, node) {
    event.preventDefault();

    // Also select this node
    if (node && node.path !== this.data.currentNode$.value?.path) {
      this.data.currentNode$.next(node);
    }

    this.menuPosition.x = event.clientX + 'px';
    this.menuPosition.y = event.clientY + 'px';

    this.matMenuTrigger.menuData = node;
    this.matMenuTrigger.openMenu();
  }

  onNodeDoubleClick(node) {
    this.treeControl.toggle(node);
  }

  preventClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  trackByKey(index: string, node: Locale) {
    return node.key;
  }

  hasChild = (_: number, node: Locale) => !!node.children && node.children.length > 0;
}

