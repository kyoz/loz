import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { NestedTreeControl, CdkNestedTreeNode } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatMenuTrigger } from '@angular/material/menu';
import { Locale } from '../../interfaces/locale';

// Services
import { AppStateService } from '../../services/app-state.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'core-tree',
  templateUrl: './tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreTreeComponent implements OnInit {
  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger; 

  treeControl = new NestedTreeControl<Locale>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Locale>();

  menuPosition = {
    x: '0',
    y: '0',
  };

  constructor(
    private appState: AppStateService,
    private data: DataService,
  ) {
    this.dataSource.data = [];
  }

  ngOnInit() {
    this.initListeners();
  }

  initListeners() {
    this.data.tree$.subscribe(tree => {
      this.dataSource.data = tree;
    });

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
    console.log(node);
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

