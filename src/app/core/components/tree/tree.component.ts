import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Locale } from '../../interfaces/locale';

// Services
import { DataService } from '../../services/data.service';

@Component({
  selector: 'core-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreTreeComponent implements OnInit {
  treeControl = new NestedTreeControl<Locale>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Locale>();

  constructor(
    private data: DataService,
  ) {
    this.dataSource.data = [];
  }

  ngOnInit() {
    this.data.tree$.subscribe(tree => {
      console.log(tree);
      this.dataSource.data = tree;
    });
  }

  hasChild = (_: number, node: Locale) => !!node.children && node.children.length > 0;
}

